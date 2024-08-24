/** @format */

import {Dialog, DialogPanel, DialogTitle, Transition} from "@headlessui/react";
import {Fragment, ReactNode} from "react";

interface IProps {
	isOpen: boolean;
	close: () => void;
	title?: string;
	description?: string;
	children: ReactNode;
}

const Modal = ({children, isOpen, close, title, description}: IProps) => {
	return (
		<>
			<Transition
				appear
				show={isOpen}
				as={Fragment}></Transition>
			<Dialog
				as='div'
				className='relative z-10 focus:outline-none'
				onClose={close}
				open={isOpen}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-black/25' />
				</Transition.Child>
				<div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'>
							<DialogPanel
								transition
								className='w-full max-w-md rounded-xl bg-white/90 p-6 backdrop-blur-3xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0'>
								<DialogTitle
									as='h3'
									className='text-base/7 font-medium text-black'>
									{title}
								</DialogTitle>
								<p className='mt-2 text-sm/6 text-black'>{description}</p>
								<div className='mt-4'>{children}</div>
							</DialogPanel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</>
	);
};

export default Modal;
