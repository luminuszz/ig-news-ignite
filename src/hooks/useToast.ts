import { ReactText } from 'react';
import { toast, ToastOptions } from 'react-toastify';

type ToastFunction = (message: string, options?: ToastOptions) => ReactText;

interface HooksReturn {
	success: ToastFunction;
	error: ToastFunction;
	warning: ToastFunction;
}

export function useToast(): HooksReturn {
	const success = (message: string, options?: ToastOptions) =>
		toast.success(message, { ...options });

	const error = (message: string, options?: ToastOptions) =>
		toast.error(message, { ...options });

	const warning = (message: string, options?: ToastOptions) =>
		toast.warning(message, { ...options });

	return {
		success,
		error,
		warning,
	};
}
