SET FOREIGN_KEY_CHECKS = 0
DELETE FROM hrm_dev.action_value;
DELETE FROM hrm_dev.actions;
DELETE FROM hrm_dev.assigned;
DELETE FROM hrm_dev.attachments;
DELETE FROM hrm_dev.attribute_values;
DELETE FROM hrm_dev.`attributes`;
DELETE FROM hrm_dev.audit_log;
DELETE FROM hrm_dev.charts;
DELETE FROM hrm_dev.criteria;
DELETE FROM hrm_dev.custom_attributes;
DELETE FROM hrm_dev.design;
DELETE FROM hrm_dev.employee_attachments;
DELETE FROM hrm_dev.employee_attribute_values;
DELETE FROM hrm_dev.employee_role;
DELETE FROM hrm_dev.employee_status;
DELETE FROM hrm_dev.employee_tokens;
DELETE FROM hrm_dev.employees;
DELETE FROM hrm_dev.folders;
DELETE FROM hrm_dev.group_attributes;
DELETE FROM hrm_dev.`groups`;
DELETE FROM hrm_dev.includes;
DELETE FROM hrm_dev.report_chart_type;
DELETE FROM hrm_dev.report_display_fields;
DELETE FROM hrm_dev.report_filter_fields;
DELETE FROM hrm_dev.report_folders;
DELETE FROM hrm_dev.report_group_by_fields;
DELETE FROM hrm_dev.reports;
DELETE FROM hrm_dev.role_type_group_attribute_action;
DELETE FROM hrm_dev.status;
DELETE FROM hrm_dev.type_action_permission;
DELETE FROM hrm_dev.type_group_attribute_permission;
DELETE FROM hrm_dev.types;
SET FOREIGN_KEY_CHECKS = 1
