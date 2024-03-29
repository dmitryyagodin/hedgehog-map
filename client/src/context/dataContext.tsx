import { Hedgehog } from '@ubigu/shared/src/hedgehog';
import { Position } from 'geojson';
import React, { ReactNode, useState } from 'react';

type DataContextType = {
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	ids: number[] | null;
	setIds: (ids: number[] | null) => void;
	hedgehogs: Hedgehog[] | null;
	setHedgehogs: (hedgehogs: Hedgehog[] | null) => void;
	selectedHedgehog: number | null;
	setSelectedHedgehog: (id: number | null) => void;
	coordinates: Position | null;
	setCoordinates: (coordinates: Position | null) => void;
};

const contextDefaultValues: DataContextType = {
	isLoading: false,
	setIsLoading: () => null,
	ids: null,
	setIds: () => null,
	hedgehogs: null,
	setHedgehogs: () => null,
	selectedHedgehog: null,
	setSelectedHedgehog: () => null,
	coordinates: null,
	setCoordinates: () => null,
};

export const DataContext = React.createContext<DataContextType>(contextDefaultValues);

type Props = {
	children: ReactNode;
};

export const ContextProvider = ({ children }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [hedgehogs, setHedgehogs] = useState<Hedgehog[] | null>(null);
	const [selectedHedgehog, setSelectedHedgehog] = useState<number | null>(null);
	const [coordinates, setCoordinates] = useState<Position | null>(null);
	const [ids, setIds] = useState<number[] | null>(null);

	const handleSetHedgehogs = (newHedgehogs: Hedgehog[] | null) => {
		setHedgehogs(prevHedgehogs => {
			if (prevHedgehogs) {

				return [...prevHedgehogs, ...(newHedgehogs || [])];
			} else {
				return newHedgehogs;
			}
		});
	};

	return (
		<DataContext.Provider
			value={{
				isLoading,
				setIsLoading,
				ids,
				setIds,
				hedgehogs,
				setHedgehogs: handleSetHedgehogs,
				selectedHedgehog,
				setSelectedHedgehog,
				coordinates,
				setCoordinates
			}}
		>
			{children}
		</DataContext.Provider>
	);
};
