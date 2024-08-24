/** @format */

// import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {LOGIN_FORM} from "../data";
import {IErrorResponse, IFormInputLogin} from "../interfaces";
import {useState} from "react";
import InputErrorMessage from "../components/InputErrorMessage";
import {AxiosError} from "axios";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import {yupResolver} from "@hookform/resolvers/yup";
import {loginSchema} from "../validation";

const LoginPage = () => {
	/* STATES */
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<IFormInputLogin>({
		resolver: yupResolver(loginSchema),
	});
	/* HANDLERS */
	const onSubmit: SubmitHandler<IFormInputLogin> = async (data) => {
		setIsLoading(true);
		try {
			const {status, data: resData} = await axiosInstance.post(
				"/auth/local",
				data,
			);
			if (status === 200) {
				toast.success("You will navigate to home page after 2 second!", {
					position: "top-center",
					duration: 2000,
					style: {
						backgroundColor: "black",
						color: "white",
						width: "fit-content",
					},
				});
			}
			localStorage.setItem("LoggedInUser", JSON.stringify(resData));
			location.replace("/");
			// setTimeout(() => location.replace("/"), 1000);
		} catch (error) {
			const objError = error as AxiosError<IErrorResponse>;
			toast.error(`${objError.response?.data.error.message}`, {
				position: "top-center",
				duration: 2000,
				style: {
					backgroundColor: "black",
					color: "white",
					width: "fit-content",
				},
			});
		} finally {
			setIsLoading(false);
		}
	};
	/* RENDER */
	const renderLoginForm = LOGIN_FORM.map(
		({name, placeholder, type, validation}, idx) => (
			<div key={idx}>
				<Input
					type={type}
					placeholder={placeholder}
					{...register(name, validation)}
				/>
				{errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
			</div>
		),
	);

	return (
		<div className='max-w-md mx-auto'>
			<h2 className='text-3xl text-center mb-4 font-semibold'>
				Login to get access!
			</h2>
			<form
				className='space-y-4'
				onSubmit={handleSubmit(onSubmit)}>
				{renderLoginForm}
				<Button
					fullWidth
					isLoading={isLoading}>
					{isLoading ? "Loading..." : "Login"}
				</Button>
			</form>
		</div>
	);
};

export default LoginPage;
