-- hrm_test.action_key definition

CREATE TABLE IF NOT EXISTS `action_key` (
  `action_key_id` int(11) NOT NULL AUTO_INCREMENT,
  `action_key_name` varchar(500) NOT NULL,
  PRIMARY KEY (`action_key_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- hrm_test.action_value definition

CREATE TABLE IF NOT EXISTS `action_value` (
  `action_value_id` int(11) NOT NULL AUTO_INCREMENT,
  `action_value_name` varchar(100) NOT NULL,
  PRIMARY KEY (`action_value_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- hrm_test.actions definition

CREATE TABLE IF NOT EXISTS `actions` (
  `action_id` int(11) NOT NULL AUTO_INCREMENT,
  `action_name` varchar(500) NOT NULL,
  `accessor` varchar(500) NOT NULL,
  PRIMARY KEY (`action_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.attribute_values definition

CREATE TABLE IF NOT EXISTS `attribute_values` (
  `attribute_value_id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_value` text DEFAULT NULL,
  PRIMARY KEY (`attribute_value_id`),
  KEY `attributesValues_attrValueId_IDX` (`attribute_value_id`) USING BTREE,
  FULLTEXT KEY `attributesValues_attrValue_IDX` (`attribute_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.`attributes` definition

CREATE TABLE IF NOT EXISTS `attributes` (
  `attribute_id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_accessor` varchar(1000) NOT NULL,
  `attribute_name` varchar(1000) NOT NULL,
  `attribute_type` varchar(500) NOT NULL,
  `attribute_order` int(11) NOT NULL,
  PRIMARY KEY (`attribute_id`),
  UNIQUE KEY `employeeAttributes_attrId_IDX` (`attribute_id`) USING BTREE,
  FULLTEXT KEY `employeeAttributes_attrAcessor_IDX` (`attribute_accessor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.audit_log definition

CREATE TABLE IF NOT EXISTS `audit_log` (
  `audit_log_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `action_id` int(11) NOT NULL,
  `time_stamp` datetime NOT NULL,
  `table_name` varchar(500) NOT NULL,
  `record_id` int(11) NOT NULL,
  `field_name` varchar(500) NOT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `additional_info` varchar(1000) DEFAULT NULL,
  `status_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`audit_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.charts definition

CREATE TABLE IF NOT EXISTS `charts` (
  `chart_id` int(11) NOT NULL AUTO_INCREMENT,
  `chart_name` varchar(500) NOT NULL,
  PRIMARY KEY (`chart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- hrm_test.employees definition

CREATE TABLE IF NOT EXISTS `employees` (
  `employee_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_username` varchar(1000) NOT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `employees_employeeId_IDX` (`employee_id`) USING BTREE,
  FULLTEXT KEY `employees_employeeUsername_IDX` (`employee_username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.folders definition

CREATE TABLE IF NOT EXISTS `folders` (
  `folder_id` int(11) NOT NULL AUTO_INCREMENT,
  `folder_name` varchar(500) NOT NULL,
  PRIMARY KEY (`folder_id`),
  FULLTEXT KEY `folders_folder_name_IDX` (`folder_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.`groups` definition

CREATE TABLE IF NOT EXISTS `groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_attribute_name` varchar(1000) NOT NULL,
  `group_attribute_order` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`group_id`),
  FULLTEXT KEY `attribute_groups_grpName_IDX` (`group_attribute_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.includes definition

CREATE TABLE IF NOT EXISTS `includes` (
  `include_id` int(11) NOT NULL AUTO_INCREMENT,
  `include_name` varchar(500) NOT NULL,
  PRIMARY KEY (`include_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.methods definition

CREATE TABLE IF NOT EXISTS `methods` (
  `method_id` int(11) NOT NULL AUTO_INCREMENT,
  `method_name` varchar(1000) NOT NULL,
  PRIMARY KEY (`method_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.report_analytics definition

CREATE TABLE IF NOT EXISTS `report_analytics` (
  `report_analytic_id` int(11) NOT NULL AUTO_INCREMENT,
  `report_analytic_name` varchar(255) NOT NULL,
  PRIMARY KEY (`report_analytic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- hrm_test.roles definition

CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(500) NOT NULL,
  `role_display_name` varchar(500) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `roles_roleId_IDX` (`role_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.status definition

CREATE TABLE IF NOT EXISTS `status` (
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `status_name` varchar(500) NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.types definition

CREATE TABLE IF NOT EXISTS `types` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(500) NOT NULL,
  `type_display` varchar(500) NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.action_key_value definition

CREATE TABLE IF NOT EXISTS `action_key_value` (
  `action_key_value_id` int(11) NOT NULL AUTO_INCREMENT,
  `action_key_id` int(11) NOT NULL,
  `action_value_id` int(11) NOT NULL,
  PRIMARY KEY (`action_key_value_id`),
  KEY `action_key_value_FK` (`action_key_id`),
  KEY `action_key_value_FK_1` (`action_value_id`),
  CONSTRAINT `action_key_value_FK` FOREIGN KEY (`action_key_id`) REFERENCES `action_key` (`action_key_id`),
  CONSTRAINT `action_key_value_FK_1` FOREIGN KEY (`action_value_id`) REFERENCES `action_value` (`action_value_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- hrm_test.criteria definition

CREATE TABLE IF NOT EXISTS `criteria` (
  `criteria_id` int(11) NOT NULL AUTO_INCREMENT,
  `attribute_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL,
  PRIMARY KEY (`criteria_id`),
  KEY `criteria_FK` (`attribute_id`),
  KEY `criteria_FK_1` (`attribute_value_id`),
  CONSTRAINT `criteria_FK` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`),
  CONSTRAINT `criteria_FK_1` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.employee_attribute_values definition

CREATE TABLE IF NOT EXISTS `employee_attribute_values` (
  `employee_attribute_value_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  `attribute_value_id` int(11) NOT NULL,
  PRIMARY KEY (`employee_attribute_value_id`),
  KEY `employee_attribute_values_FK` (`employee_id`),
  KEY `employee_attribute_values_FK_1` (`attribute_id`),
  KEY `employee_attribute_values_FK_2` (`attribute_value_id`),
  CONSTRAINT `employee_attribute_values_FK` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `employee_attribute_values_FK_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`),
  CONSTRAINT `employee_attribute_values_FK_2` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`attribute_value_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.employee_report_method definition

CREATE TABLE IF NOT EXISTS `employee_report_method` (
  `employee_report_method_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `method_id` int(11) NOT NULL,
  `asigned_supervisor` int(11) DEFAULT NULL,
  PRIMARY KEY (`employee_report_method_id`),
  KEY `employee_report_method_FK` (`method_id`),
  KEY `employee_report_method_FK_1` (`employee_id`),
  CONSTRAINT `employee_report_method_FK` FOREIGN KEY (`method_id`) REFERENCES `methods` (`method_id`),
  CONSTRAINT `employee_report_method_FK_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.employee_role definition

CREATE TABLE IF NOT EXISTS `employee_role` (
  `employee_role_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`employee_role_id`),
  KEY `employee_role_FK_1` (`employee_id`),
  KEY `employee_role_role_id_IDX` (`role_id`,`employee_id`,`employee_role_id`) USING BTREE,
  CONSTRAINT `employee_role_FK` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  CONSTRAINT `employee_role_FK_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.employee_status definition

CREATE TABLE IF NOT EXISTS `employee_status` (
  `employee_status_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  PRIMARY KEY (`employee_status_id`),
  KEY `employee_status_FK` (`employee_id`),
  KEY `employee_status_FK_1` (`status_id`),
  KEY `employee_status_employee_status_id_IDX` (`employee_status_id`,`employee_id`,`status_id`) USING BTREE,
  CONSTRAINT `employee_status_FK` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `employee_status_FK_1` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- hrm_test.group_attributes definition

CREATE TABLE IF NOT EXISTS `group_attributes` (
  `group_attribute_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `attribute_id` int(11) NOT NULL,
  PRIMARY KEY (`group_attribute_id`),
  KEY `employee_group_attributes_FK` (`group_id`),
  KEY `employee_group_attributes_FK_1` (`attribute_id`),
  CONSTRAINT `employee_group_attributes_FK` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`),
  CONSTRAINT `employee_group_attributes_FK_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.report_analytic_criteria definition

CREATE TABLE IF NOT EXISTS `report_analytic_criteria` (
  `report_analytic_criteria_id` int(11) NOT NULL AUTO_INCREMENT,
  `report_analytic_id` int(11) NOT NULL,
  `criteria_id` int(11) NOT NULL,
  PRIMARY KEY (`report_analytic_criteria_id`),
  KEY `report_analytic_criteria_FK` (`criteria_id`),
  KEY `report_analytic_criteria_FK_1` (`report_analytic_id`),
  CONSTRAINT `report_analytic_criteria_FK` FOREIGN KEY (`criteria_id`) REFERENCES `criteria` (`criteria_id`),
  CONSTRAINT `report_analytic_criteria_FK_1` FOREIGN KEY (`report_analytic_id`) REFERENCES `report_analytics` (`report_analytic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.report_analytic_includes definition

CREATE TABLE IF NOT EXISTS `report_analytic_includes` (
  `report_analytic_include_id` int(11) NOT NULL AUTO_INCREMENT,
  `report_analytic_id` int(11) NOT NULL,
  `include_id` int(11) NOT NULL,
  PRIMARY KEY (`report_analytic_include_id`),
  KEY `report_analytic_includes_FK` (`include_id`),
  KEY `report_analytic_includes_FK_1` (`report_analytic_id`),
  CONSTRAINT `report_analytic_includes_FK` FOREIGN KEY (`include_id`) REFERENCES `includes` (`include_id`),
  CONSTRAINT `report_analytic_includes_FK_1` FOREIGN KEY (`report_analytic_id`) REFERENCES `report_analytics` (`report_analytic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.report_folder definition

CREATE TABLE IF NOT EXISTS `report_folder` (
  `report_folder_id` int(11) NOT NULL AUTO_INCREMENT,
  `folder_id` int(11) NOT NULL,
  `report_analytic_id` int(11) NOT NULL,
  PRIMARY KEY (`report_folder_id`),
  KEY `report_folder_FK_folder_id` (`folder_id`),
  KEY `report_folder_FK_report_analytic_id` (`report_analytic_id`),
  CONSTRAINT `report_folder_FK_folder_id` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`folder_id`),
  CONSTRAINT `report_folder_FK_report_analytic_id` FOREIGN KEY (`report_analytic_id`) REFERENCES `report_analytics` (`report_analytic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.role_type_action_permission definition

CREATE TABLE IF NOT EXISTS `role_type_action_permission` (
  `role_type_action_permission_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `action_key_value_id` int(11) NOT NULL,
  PRIMARY KEY (`role_type_action_permission_id`),
  KEY `role_type_action_permission_FK` (`role_id`),
  KEY `role_type_action_permission_FK_1` (`type_id`),
  KEY `role_type_action_permission_FK_2` (`action_key_value_id`),
  CONSTRAINT `role_type_action_permission_FK` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  CONSTRAINT `role_type_action_permission_FK_1` FOREIGN KEY (`type_id`) REFERENCES `types` (`type_id`),
  CONSTRAINT `role_type_action_permission_FK_2` FOREIGN KEY (`action_key_value_id`) REFERENCES `action_key_value` (`action_key_value_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.role_type_group_attribute_action definition

CREATE TABLE IF NOT EXISTS `role_type_group_attribute_action` (
  `role_type_group_attribute_action_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `group_attribute_id` int(11) NOT NULL,
  `action_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  PRIMARY KEY (`role_type_group_attribute_action_id`),
  KEY `role_group_attribute_action_value_FK` (`role_id`),
  KEY `role_group_attribute_action_value_FK_1` (`action_id`),
  KEY `role_group_attribute_action_FK` (`group_attribute_id`),
  KEY `role_group_attribute_action_FK_1` (`type_id`),
  CONSTRAINT `role_group_attribute_action_FK` FOREIGN KEY (`group_attribute_id`) REFERENCES `group_attributes` (`group_attribute_id`),
  CONSTRAINT `role_group_attribute_action_FK_1` FOREIGN KEY (`type_id`) REFERENCES `types` (`type_id`),
  CONSTRAINT `role_group_attribute_action_value_FK` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  CONSTRAINT `role_group_attribute_action_value_FK_1` FOREIGN KEY (`action_id`) REFERENCES `actions` (`action_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.type_action_permission definition

CREATE TABLE IF NOT EXISTS `type_action_permission` (
  `type_action_permission_id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(11) NOT NULL,
  `action_key_value_id` int(11) NOT NULL,
  PRIMARY KEY (`type_action_permission_id`),
  KEY `type_action_key_value_FK_1` (`action_key_value_id`),
  KEY `type_action_key_value_FK` (`type_id`),
  CONSTRAINT `type_action_key_value_FK` FOREIGN KEY (`type_id`) REFERENCES `types` (`type_id`),
  CONSTRAINT `type_action_key_value_FK_1` FOREIGN KEY (`action_key_value_id`) REFERENCES `action_key_value` (`action_key_value_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- hrm_test.type_group_attribute_permission definition

CREATE TABLE IF NOT EXISTS `type_group_attribute_permission` (
  `type_group_attribute_permission_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  PRIMARY KEY (`type_group_attribute_permission_id`),
  KEY `role_type_group_attribute_permission_FK` (`group_id`),
  KEY `role_type_group_attribute_permission_FK_1` (`type_id`),
  CONSTRAINT `role_type_group_attribute_permission_FK` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`),
  CONSTRAINT `role_type_group_attribute_permission_FK_1` FOREIGN KEY (`type_id`) REFERENCES `types` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.design definition

CREATE TABLE IF NOT EXISTS `design` (
  `design_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_attribute_id` int(11) NOT NULL,
  PRIMARY KEY (`design_id`),
  KEY `design_FK` (`group_attribute_id`),
  CONSTRAINT `design_FK` FOREIGN KEY (`group_attribute_id`) REFERENCES `group_attributes` (`group_attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.report_analytic_design definition

CREATE TABLE IF NOT EXISTS `report_analytic_design` (
  `report_analytic_design_id` int(11) NOT NULL AUTO_INCREMENT,
  `report_analytic_id` int(11) NOT NULL,
  `design_id` int(11) NOT NULL,
  PRIMARY KEY (`report_analytic_design_id`),
  KEY `report_analytic_design_FK` (`design_id`),
  KEY `report_analytic_design_FK_1` (`report_analytic_id`),
  CONSTRAINT `report_analytic_design_FK` FOREIGN KEY (`design_id`) REFERENCES `design` (`design_id`),
  CONSTRAINT `report_analytic_design_FK_1` FOREIGN KEY (`report_analytic_id`) REFERENCES `report_analytics` (`report_analytic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- hrm_test.employee_tokens definition
CREATE TABLE IF NOT EXISTS employee_tokens (
    `employee_token_id` int(11)  NOT NULL AUTO_INCREMENT,
    `employee_id` int(11) NOT NULL,
    `token` TEXT NOT NULL,
    `created_at` DATETIME  default CURRENT_TIMESTAMP,
    PRIMARY KEY (`employee_token_id`),
    CONSTRAINT `employee_id_FK` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


CREATE TABLE IF NOT EXISTS attribute_display (
    `attribute_display_id` int(11)  NOT NULL AUTO_INCREMENT,
    `attribute_id` int(11) NOT NULL,
    PRIMARY KEY (`attribute_display_id`),
    CONSTRAINT `attribute_id_FK` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


CREATE OR REPLACE VIEW v_employee_role AS 
    SELECT
        `employees`.`employee_id`,
        `employees`.`email`,
        `roles`.`role_id`,
        `roles`.`role_name`,
        `roles`.`role_display`
    FROM employee_role
    INNER JOIN `employees` ON `employee_role`.`employee_id` = `employees`.`employee_id`
    INNER JOIN `roles` ON `employee_role`.`role_id` = `roles`.`role_id`;


-- hrm_test.v_employee_tokens definition
CREATE  OR REPLACE VIEW v_employee_tokens AS 
    SELECT  
        `employees`.`employee_username`,
        `employee_tokens`.`token`,
        `status`.`status`
    FROM employee_tokens
    INNER JOIN `employees` ON `employees`.`employee_id` = `employee_tokens`.`employee_id`,
    INNER JOIN `status` ON `status`.`status_id` = `employee_tokens`.`status_id`
    





ALTER TABLE `groups` CHANGE group_attribute_name group_name varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL;
ALTER TABLE `groups` ADD group_accessor varchar(1000) NOT NULL AFTER group_name;
ALTER TABLE `groups` CHANGE group_attribute_order group_order varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NOT NULL;
ALTER TABLE `groups` MODIFY COLUMN group_order varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL NOT NULL;
CREATE INDEX groups_group_accessor_IDX USING BTREE ON `groups` (group_accessor);


ALTER TABLE `attributes` ADD is_required INT(2) NOT NULL AFTER attribute_type;

ALTER TABLE `attributes` ADD description TEXT NULL AFTER is_required;
ALTER TABLE `groups` ADD description TEXT NULL AFTER group_accessor ;

ALTER TABLE `employees` ADD svi_email VARCHAR(500) NOT NULL AFTER employee_id ;
ALTER TABLE `employees` ADD first_name VARCHAR(500) NOT NULL AFTER svi_email ;
ALTER TABLE `employees` ADD middle_name VARCHAR(500)  NULL AFTER first_name ;
ALTER TABLE `employees` ADD last_name VARCHAR(500) NOT NULL AFTER middle_name ;
ALTER TABLE `employees` ADD image_url TEXT NULL AFTER last_name;
ALTER TABLE `employees` DROP COLUMN employee_username;


INSERT INTO `attribute_values` (attribute_value_id, attribute_value) VALUES (1, '');


create view v_employee_cols as 
SELECT 
	employees.employee_id,
	attributes.attribute_accessor,
	attribute_values.attribute_value
FROM employee_attribute_values
	INNER JOIN employees ON employees.employee_id = employee_attribute_values.employee_id
	INNER JOIN attributes ON attributes.attribute_id = employee_attribute_values.attribute_id
	INNER JOIN attribute_values ON attribute_values.attribute_value_id = employee_attribute_values.attribute_value_id;






