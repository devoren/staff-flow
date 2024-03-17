import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { IUser } from "src/api/users";
import "dayjs/locale/ru";

export const columns: ColumnDef<IUser>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Имя",
	},
	{
		accessorKey: "status",
		header: "Статус",
		cell: ({ row }) => {
			const status = row.getValue("status");
			if (status === 1) {
				return "На работе";
			} else {
				return "На Рахате";
			}
		},
	},
	{
		accessorKey: "arrival_time",
		header: "Время прихода",
		cell: ({ row }) => {
			const arrivalTime = row.getValue<string | null>("arrival_time");
			if (arrivalTime) {
				return dayjs(arrivalTime).locale("ru").format("D MMMM, HH:mm");
			}
		},
	},
	{
		accessorKey: "leave_time",
		header: "Время ухода",
		cell: ({ row }) => {
			const leaveTime = row.getValue<string | null>("leave_time");
			if (leaveTime) {
				return dayjs(leaveTime).locale("ru").format("D MMMM, HH:mm");
			}
		},
	},
];
