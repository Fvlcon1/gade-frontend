'use client'

import React, { createContext, useCallback, useContext, useState, ReactNode } from "react";
import ConfirmationModal from "./confirmation-modal";

// Types for modal props
interface ConfirmationModalOptions {
	description?: string;
	children?: React.ReactNode;
	onConfirm: () => void;
	cta?: string;
	loading?: boolean | (() => boolean);
	title?: string;
	icon?: React.ReactNode;
	color?: string;
}

interface ConfirmationModalContextType {
	showConfirmation: (options: ConfirmationModalOptions) => void;
	hideConfirmation: () => void;
}

const ConfirmationModalContext = createContext<ConfirmationModalContextType | undefined>(undefined);

export const useConfirmationModal = () => {
	const ctx = useContext(ConfirmationModalContext);
	if (!ctx) throw new Error("useConfirmationModal must be used within a ConfirmationModalProvider");
	return ctx.showConfirmation;
};

export const ConfirmationModalProvider = ({ children }: { children: ReactNode }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [modalProps, setModalProps] = useState<ConfirmationModalOptions | null>(null);

	const showConfirmation = useCallback((options: ConfirmationModalOptions) => {
		if (!options.onConfirm) throw new Error('onConfirm is required');
		setModalProps(options);
		setIsVisible(true);
	}, []);

	const hideConfirmation = useCallback(() => {
		setIsVisible(false);
		setTimeout(() => setModalProps(null), 300); // allow animation to finish
	}, []);

	return (
		<ConfirmationModalContext.Provider value={{ showConfirmation, hideConfirmation }}>
			{children}
			<ConfirmationModal
				isVisible={isVisible}
				close={hideConfirmation}
				{...(modalProps || {})}
				onConfirm={modalProps?.onConfirm || (() => { })}
			/>
		</ConfirmationModalContext.Provider>
	);
};
