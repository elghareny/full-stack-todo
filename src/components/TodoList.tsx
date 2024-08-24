/** @format */
import Button from "./ui/Button";
import {ITodo} from "../interfaces";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import {ChangeEvent, FormEvent, useState} from "react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import axiosInstance from "../config/axios.config";
import TodoSkeleton from "./TodoSkeleton";

const TodoList = () => {
	/* STATE */
	const initialTodo: ITodo = {
		id: 0,
		title: "",
		description: "",
	};
	const initialTodoAdd = {
		title: "",
		description: "",
	};
	const [queryVersion, setQueryVersion] = useState(1);
	const [todoEdit, setTodoEdit] = useState<ITodo>(initialTodo);
	const [todoAdd, setTodoAdd] = useState(initialTodoAdd);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
	const [isOpenAddModal, setIsOpenAddModal] = useState(false);
	const storageKey = "LoggedInUser";
	const userDataString = localStorage.getItem(storageKey);
	const userData = userDataString ? JSON.parse(userDataString) : null;

	/* HANDLER */

	const {isLoading, data} = useAuthenticatedQuery({
		queryKey: ["TodoList", `${queryVersion}`],
		url: "/users/me?populate=todos",
		config: {
			headers: {
				Authorization: `Bearer ${userData?.jwt}`,
			},
		},
	});

	const onCloseEditModel = () => {
		setTodoEdit(initialTodo);
		setIsEditModalOpen(false);
	};
	const onOpenEditModel = (todo: ITodo) => {
		setTodoEdit(todo);
		setIsEditModalOpen(true);
	};

	const onChangeHandler = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const {value, name} = e.target;
		setTodoEdit({...todoEdit, [name]: value});
	};

	const onChangeAddTodoHandler = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const {value, name} = e.target;
		setTodoAdd({...todoAdd, [name]: value});
	};

	const onSubmitEditHandler = async (e: FormEvent<HTMLFormElement>) => {
		const {title, description} = todoEdit;
		e.preventDefault();
		setIsUpdating(true);
		try {
			const {status} = await axiosInstance.put(
				`/todos/${todoEdit.id}`,
				{
					data: {title, description},
				},
				{
					headers: {
						Authorization: `Bearer ${userData?.jwt}`,
					},
				},
			);
			if (status === 200) {
				setQueryVersion((prev) => prev + 1);
				onCloseEditModel();
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsUpdating(false);
		}
	};

	const onSubmitAddTodoHandler = async (e: FormEvent<HTMLFormElement>) => {
		const {title, description} = todoAdd;
		e.preventDefault();
		setIsAdding(true);
		try {
			const {status} = await axiosInstance.post(
				`/todos`,
				{
					data: {title, description, user: [userData.user.id]},
				},
				{
					headers: {
						Authorization: `Bearer ${userData?.jwt}`,
					},
				},
			);
			if (status === 200) {
				setQueryVersion((prev) => prev + 1);
				closeAddModal();
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsAdding(false);
		}
	};

	/* DELETING TODO */

	const onRemove = async () => {
		setIsDeleting(true);
		try {
			const {status} = await axiosInstance.delete(`/todos/${todoEdit.id}`, {
				headers: {Authorization: `Bearer ${userData?.jwt}`},
			});
			if (status === 200) {
				setQueryVersion((prev) => prev + 1);
				closeConfirmModal();
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsDeleting(false);
		}
	};
	const closeConfirmModal = () => {
		setTodoEdit(initialTodo);
		setIsOpenConfirmModal(false);
	};
	const openConfirmModal = (todo: ITodo) => {
		setTodoEdit(todo);
		setIsOpenConfirmModal(true);
	};

	const closeAddModal = () => {
		setTodoAdd(initialTodoAdd);
		setIsOpenAddModal(false);
	};
	const openAddModal = () => {
		setIsOpenAddModal(true);
	};

	if (isLoading)
		return (
			<>
				{Array.from({length: 10}, (_, idx) => (
					<TodoSkeleton key={idx} />
				))}
			</>
		);

	return (
		<div className=' space-y-1'>
			<div className='flex justify-center mb-5 space-x-5'>
				<Button
					type='button'
					size={"sm"}
					onClick={openAddModal}>
					Post new todo
				</Button>
			</div>
			{data.todos.length ? (
				data.todos.map((todo: ITodo) => {
					return (
						<div
							key={todo.id}
							className='flex items-center justify-between translation-all duration-300 rounded-lg p-3 hover:bg-gray-100 even:bg-gray-100'>
							<p className='w-full font-semibold'>
								{" "}
								{todo.id} - {todo.title}
							</p>
							<div className='flex items-center justify-end w-full space-x-3'>
								<Button
									type='button'
									onClick={() => onOpenEditModel(todo)}
									size={"sm"}>
									Edit
								</Button>
								<Button
									type='button'
									variant={"danger"}
									size={"sm"}
									onClick={() => {
										openConfirmModal(todo);
									}}>
									Remove
								</Button>
							</div>
						</div>
					);
				})
			) : (
				<h2>No Todo Found</h2>
			)}

			{/* /*- Add Todo *-/ */}

			<Modal
				isOpen={isOpenAddModal}
				close={closeAddModal}
				title='Add a new todo'>
				<form
					className='space-y-4'
					onSubmit={onSubmitAddTodoHandler}>
					<Input
						name='title'
						value={todoAdd.title}
						onChange={onChangeAddTodoHandler}
					/>
					<Textarea
						name='description'
						value={todoAdd.description}
						onChange={onChangeAddTodoHandler}
					/>
					<div className='flex items-center space-x-3 mt-5'>
						<Button
							className='w-full bg-indigo-700 hover:bg-indigo-800'
							isLoading={isAdding}>
							Done
						</Button>
						<Button
							type='button'
							className='w-full'
							variant={"cancel"}
							onClick={closeAddModal}>
							Cancel
						</Button>
					</div>
				</form>
			</Modal>

			{/* /*- Edit Todo *-/ */}

			<Modal
				isOpen={isEditModalOpen}
				close={onCloseEditModel}
				title='Edit this todo'>
				<form
					className='space-y-4'
					onSubmit={onSubmitEditHandler}>
					<Input
						name='title'
						value={todoEdit.title}
						onChange={onChangeHandler}
					/>
					<Textarea
						name='description'
						value={todoEdit.description}
						onChange={onChangeHandler}
					/>
					<div className='flex items-center space-x-3 mt-5'>
						<Button
							className='w-full bg-indigo-700 hover:bg-indigo-800'
							isLoading={isUpdating}>
							Update
						</Button>
						<Button
							type='button'
							className='w-full'
							variant={"cancel"}
							onClick={onCloseEditModel}>
							Cancel
						</Button>
					</div>
				</form>
			</Modal>

			{/* /*- Remove Todo *-/ */}

			<Modal
				isOpen={isOpenConfirmModal}
				close={closeConfirmModal}
				title='Are you sure you want to remove this todo from your store ?'
				description='Deleting this todo will remove it permenantly from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action.'>
				<div className='flex items-center space-x-3 mt-4'>
					<Button
						className='w-full'
						variant='danger'
						onClick={onRemove}
						isLoading={isDeleting}>
						Yes , Remove
					</Button>
					<Button
						className='w-full'
						variant='cancel'
						type='button'
						onClick={closeConfirmModal}>
						Cancel
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export default TodoList;
