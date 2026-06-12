// Copyright (c) 2026, Arslan and contributors
// For license information, please see license.txt

frappe.ui.form.on("Employee Complaint", {

	onload: function (frm) {
		// Auto-fill the Employee field from the currently logged-in user
		if (frm.is_new()) {
			frappe.db.get_value(
				"Employee",
				{ user_id: frappe.session.user },
				["name", "employee_name", "department"],
				function (r) {
					if (r && r.name) {
						frm.set_value("employee", r.name);
						frm.set_value("employee_name", r.employee_name);
						frm.set_value("employee_id", r.name);
						frm.set_value("department", r.department);
					}
				}
			);
			frm.set_value("status", "Submitted");
		}
	},

	setup: function (frm) {
		// Lock status and HR Remarks for non-HR Officers
		frappe.user_roles.then(function (roles) {
			const isHROfficer = roles.includes("HR Officer");
			const isAdmin = frappe.session.user === "Administrator";

			if (!isHROfficer && !isAdmin) {
				frm.set_df_property("status", "read_only", 1);
				frm.set_df_property("hr_remarks", "read_only", 1);
			}

			// Prevent employees from changing the Employee field on saved records
			if (!isHROfficer && !isAdmin && !frm.is_new()) {
				frm.set_df_property("employee", "read_only", 1);
			}
		});
	},

	employee: function (frm) {
		if (frm.doc.employee) {
			frappe.db.get_value(
				"Employee",
				frm.doc.employee,
				["employee_name", "department"],
				function (r) {
					if (r) {
						frm.set_value("employee_name", r.employee_name);
						frm.set_value("employee_id", frm.doc.employee);
						frm.set_value("department", r.department);
					}
				}
			);
		}
	},

	refresh: function (frm) {
		// Colour-coded status indicator in the form header
		const statusColours = {
			"Submitted":    "blue",
			"Under Review": "orange",
			"Resolved":     "green",
		};
		if (frm.doc.status) {
			frm.page.set_indicator(
				__(frm.doc.status),
				statusColours[frm.doc.status] || "gray"
			);
		}

		// Quick-action buttons visible only to HR Officers
		frappe.user_roles.then(function (roles) {
			const isHROfficer = roles.includes("HR Officer");
			const isAdmin = frappe.session.user === "Administrator";

			if ((isHROfficer || isAdmin) && !frm.is_new()) {
				if (frm.doc.status === "Submitted") {
					frm.add_custom_button(__("Mark Under Review"), function () {
						frm.set_value("status", "Under Review");
						frm.save();
					}, __("Actions"));
				}

				if (frm.doc.status === "Under Review") {
					frm.add_custom_button(__("Mark Resolved"), function () {
						frm.set_value("status", "Resolved");
						frm.save();
					}, __("Actions"));
				}
			}
		});
	},
});
