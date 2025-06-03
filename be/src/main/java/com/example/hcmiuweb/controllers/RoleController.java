package com.example.hcmiuweb.controllers;

import com.example.hcmiuweb.entities.Role;
import com.example.hcmiuweb.services.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "http://172.18.0.3:5173", 
    "http://netflex.id.vn", 
    "http://netflex.id.vn/api"
})
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.findAllRoles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        return roleService.findRoleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{roleName}")
    public ResponseEntity<Role> getRoleByName(@PathVariable String roleName) {
        return roleService.findRoleByName(roleName)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        if (role.getRoleName() == null || role.getRoleName().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Role savedRole = roleService.createRole(role);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRole);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody Role role) {
        return roleService.findRoleById(id)
                .map(existingRole -> {
                    role.setId(id);
                    return ResponseEntity.ok(roleService.updateRole(role));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        return roleService.findRoleById(id)
                .map(role -> {
                    roleService.deleteRole(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}