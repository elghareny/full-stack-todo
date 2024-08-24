/** @format */

import {SubmitHandler, useForm} from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {IErrorResponse, IFormInputRegister} from "../interfaces";
import InputErrorMessage from "../components/InputErrorMessage";
import {REGISTER_FORM} from "../data";
import {useState} from "react";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";
import {yupResolver} from "@hookform/resolvers/yup";
import {registerSchema} from "../validation";

const RegisterPage = () => {
	/* STATES */
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<IFormInputRegister>({
		resolver: yupResolver(registerSchema),
	});

	/* 	HANDLERS */

	const onSubmit: SubmitHandler<IFormInputRegister> = async (data) => {
		setIsLoading(true);
		try {
			const {status} = await axiosInstance.post("/auth/local/register", data);
			if (status == 200) {
				toast.success(
					"You will navigate to the login page after 2 second to login!",
					{
						position: "top-center",
						duration: 2000,
						style: {
							backgroundColor: "black",
							color: "white",
							width: "fit-content",
						},
					},
				);
			}
			navigate("/login");
			// setTimeout(() => {
			// 	navigate("/login");
			// }, 1000);
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

	const renderRegisterForm = REGISTER_FORM.map(
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
				Register to get access!
			</h2>
			<form
				className='space-y-4'
				onSubmit={handleSubmit(onSubmit)}>
				{renderRegisterForm}
				<Button
					fullWidth
					isLoading={isLoading}>
					{isLoading ? "Loading..." : "Register"}
				</Button>
			</form>
		</div>
	);
};

export default RegisterPage;
