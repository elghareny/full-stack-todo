/** @format */
import {faker} from "@faker-js/faker";
import {ChangeEvent, useState} from "react";
import TodoSkeleton from "../components/TodoSkeleton";
import Paginator from "../components/ui/Paginator";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Button from "../components/ui/Button";
import axiosInstance from "../config/axios.config";

const TodosPage = () => {
	const storageKey = "LoggedInUser";
	const userDataString = localStorage.getItem(storageKey);
	const userData = userDataString ? JSON.parse(userDataString) : null;
	const [pageSize, setPageSize] = useState<number>(10);
	const [page, setPage] = useState<number>(1);
	const [sortBy, setSortBy] = useState<string>("DESC");
	const {isLoading, data, isFetching} = useAuthenticatedQuery({
		queryKey: [`todos-page-${page}`, `${pageSize}`, `${sortBy}`],
		url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
		config: {
			headers: {
				Authorization: `Bearer ${userData?.jwt}`,
			},
		},
	});

	// /*- HANDLER *-/

	const onClickPrev = () => {
		setPage((prev) => prev - 1);
	};
	const onClickNext = () => {
		setPage((prev) => prev + 1);
	};

	const onGenerateTodos = async () => {
		for (let i = 0; i < 100; i++)
			try {
				await axiosInstance.post(
					`/todos`,
					{
						data: {
							title: faker.word.words(5),
							description: faker.lorem.paragraph(2),
							user: [userData.user.id],
						},
					},
					{
						headers: {
							Authorization: `Bearer ${userData?.jwt}`,
						},
					},
				);
			} catch (error) {
				console.log(error);
			}
	};

	const onChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
		setPageSize(+e.target.value);
	};

	const onChangeSortBy = (e: ChangeEvent<HTMLSelectElement>) => {
		setSortBy(e.target.value);
	};

	if (isLoading)
		return (
			<>
				{Array.from({length: 5}, (_, idx) => (
					<TodoSkeleton key={idx} />
				))}
			</>
		);

	return (
		<div className='my-5 space-y-1'>
			<div className='flex justify-between items-center my-3'>
				<Button
					type='button'
					size={"sm"}
					onClick={onGenerateTodos}>
					Generate todos
				</Button>
				<div className='flex space-x-2'>
					<select
						className='border-2 border-indigo-600 rounded-md p-2'
						value={sortBy}
						onChange={onChangeSortBy}
						aria-label='Sort'>
						<option
							disabled
							label='Sort by'>
							Sort by
						</option>
						<option
							label='ASC'
							value='ASC'>
							Oldest
						</option>
						<option
							label='DESC'
							value='DESC'>
							Latest
						</option>
					</select>
					<select
						className='border-2 border-indigo-600 rounded-md p-2'
						value={pageSize}
						onChange={onChangePageSize}
						aria-label='Page size'>
						<option
							disabled
							label='Page size'>
							Page size
						</option>
						<option
							label='10'
							value={10}>
							10
						</option>
						<option
							label='20'
							value={20}>
							20
						</option>
						<option
							label='50'
							value={50}>
							50
						</option>
						<option
							label='100'
							value={100}>
							100
						</option>
					</select>
				</div>
			</div>
			{data.data.length ? (
				data.data.map(
					({id, attributes}: {id: number; attributes: {title: string}}) => {
						return (
							<div
								key={id}
								className='flex items-center justify-between translation-all duration-300 rounded-lg p-3 hover:bg-gray-100 even:bg-gray-100'>
								<h3 className='w-full font-semibold'>
									{" "}
									{id} - {attributes.title}
								</h3>
							</div>
						);
					},
				)
			) : (
				<h2>No Todo Found</h2>
			)}
			<div className='space-y-5'>
				<Paginator
					isLoading={isLoading || isFetching}
					onClickNext={onClickNext}
					onClickPrev={onClickPrev}
					page={page}
					pageCount={data.meta.pagination.pageCount}
					total={data.meta.pagination.total}
				/>
			</div>
		</div>
	);
};

export default TodosPage;
