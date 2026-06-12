frappe.listview_settings["Offboarding Interview"] = {
	add_fields: ["status"],
	get_indicator(doc) {
		const colour = {
			"Scheduled": "blue",
			"In Progress": "yellow",
			"Completed": "cyan",
			"Pending Line Manager": "orange",
			"Pending HR Officer": "orange",
			"Pending Operations Manager": "orange",
			"Pending COO": "orange",
			"Pending HR Manager": "orange",
			"Approved": "green",
			"Rejected": "red"
		};
		return [__(doc.status), colour[doc.status] || "gray", "status,=," + doc.status];
	}
};
