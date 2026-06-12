// Copyright (c) 2026, Arslan and contributors
// For license information, please see license.txt

frappe.ui.form.on("Employee Data Adjustment Request", {
    onload: function(frm) {
        // Dynamic Employee fields fetch karne ka method
        frm.trigger("set_employee_fields");
    },
    
    set_employee_fields: function(frm) {
        // Ye method dynamic fields ko fetch karega
        frappe.model.with_doctype("Employee", function() {
            var fields = frappe.meta.get_docfields("Employee");
            var options = [""];
            
            $.each(fields, function(i, field) {
                // Dynamic fields filter (jo bhi Employee doctype mein add honge woh auto include honge)
                if (field.fieldtype && field.label && 
                    field.fieldtype != "Section Break" && 
                    field.fieldtype != "Column Break" && 
                    field.fieldtype != "Tab Break" &&
                    field.fieldtype != "Button" &&
                    field.fieldtype != "HTML" &&
                    field.fieldtype != "Attach" &&
                    field.fieldtype != "Image") {
                    
                    options.push(field.label);
                }
            });
            
            console.log("Dynamic Fields Loaded:", options.length);
            
            // Child table mein options set karein
            if (frm.fields_dict["items"]) {
                frm.fields_dict["items"].grid.update_docfield_property(
                    "field_to_be_updated", 
                    "options", 
                    options
                );
            }
        });
    },
    
    refresh: function(frm) {
        if (frm.doc.__islocal) {
            frm.trigger("set_employee_fields");
        }
    }
});

// Child table mein dynamic options set karne ke liye
frappe.ui.form.on("Employee Adjustment Items", {
    before_items_add: function(frm, cdt, cdn) {
        // Naya row add karne se pehle options set karein
        frm.trigger("set_employee_fields");
    }
});