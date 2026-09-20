package com.airbooking.model;

import com.airbooking.enums.UserRole;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/**
 * Admin Entity demonstrating OOP Inheritance.
 * Admin specializes User with administrative privileges and department details.
 */
@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends User {

    private String adminDepartment = "Flight Operations";
    private String employeeCode = "ADM-" + System.currentTimeMillis() % 10000;

    public Admin() {
        super();
        setRole(UserRole.ADMIN);
    }

    public Admin(String name, String email, String phone, String password, String adminDepartment) {
        super(name, email, phone, password, UserRole.ADMIN);
        this.adminDepartment = adminDepartment;
    }

    public String getAdminDepartment() {
        return adminDepartment;
    }

    public void setAdminDepartment(String adminDepartment) {
        this.adminDepartment = adminDepartment;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }
}
