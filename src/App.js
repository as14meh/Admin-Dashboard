import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Check, Users, Shield, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock initial data
const initialUsers = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@example.com', role: 'supervisor', status: 'active' },
  { id: 2, name: 'Miguel Rodriguez', email: 'miguel@example.com', role: 'manager', status: 'active' },
];

const initialRoles = [
  { id: 1, name: 'supervisor', permissions: ['read', 'write', 'delete', 'manage_users', 'manage_roles'] },
  { id: 2, name: 'manager', permissions: ['read', 'write', 'delete', 'manage_users'] },
  { id: 3, name: 'associate', permissions: ['read', 'write'] },
  { id: 4, name: 'intern', permissions: ['read'] },
];

const allPermissions = ['read', 'write', 'delete', 'manage_users', 'manage_roles'];

const Dashboard = () => {
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  // User Management Functions
  const addUser = (user) => {
    setUsers([...users, { ...user, id: users.length + 1 }]);
    setIsUserDialogOpen(false);
  };

  const updateUser = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setIsUserDialogOpen(false);
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Role Management Functions
  const addRole = (role) => {
    setRoles([...roles, { ...role, id: roles.length + 1 }]);
    setIsRoleDialogOpen(false);
  };

  const updateRole = (updatedRole) => {
    setRoles(roles.map(role => role.id === updatedRole.id ? updatedRole : role));
    setIsRoleDialogOpen(false);
  };

  const deleteRole = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  // User Form Component
  const UserForm = ({ user, onSubmit }) => {
    const [formData, setFormData] = useState(user || { name: '', email: '', role: 'intern', status: 'active' });

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }} className="space-y-4">
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
        <Input
          placeholder="Email"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
        />
        <Select 
          value={formData.role}
          onValueChange={(value) => setFormData({...formData, role: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => (
              <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({...formData, status: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full">
          {user ? 'Update User' : 'Add User'}
        </Button>
      </form>
    );
  };

  // Role Form Component
  const RoleForm = ({ role, onSubmit }) => {
    const [formData, setFormData] = useState(role || { name: '', permissions: [] });

    const togglePermission = (permission) => {
      const newPermissions = formData.permissions.includes(permission)
        ? formData.permissions.filter(p => p !== permission)
        : [...formData.permissions, permission];
      setFormData({ ...formData, permissions: newPermissions });
    };

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }} className="space-y-4">
        <Input
          placeholder="Role Name"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Permissions</h4>
          <div className="space-y-2">
            {allPermissions.map(permission => (
              <div key={permission} className="flex items-center space-x-2">
                <Checkbox
                  id={permission}
                  checked={formData.permissions.includes(permission)}
                  onCheckedChange={() => togglePermission(permission)}
                />
                <label htmlFor={permission} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {permission}
                </label>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full">
          {role ? 'Update Role' : 'Add Role'}
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Manage your users and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users size={16} />
                  Users
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-2">
                  <Shield size={16} />
                  Roles
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Users</h2>
                  <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingUser(null)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                      </DialogHeader>
                      <UserForm
                        user={editingUser}
                        onSubmit={(userData) => {
                          if (editingUser) {
                            updateUser({ ...userData, id: editingUser.id });
                          } else {
                            addUser(userData);
                          }
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="secondary">{user.role}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingUser(user);
                                  setIsUserDialogOpen(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="roles">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Roles</h2>
                  <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingRole(null)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
                      </DialogHeader>
                      <RoleForm
                        role={editingRole}
                        onSubmit={(roleData) => {
                          if (editingRole) {
                            updateRole({ ...roleData, id: editingRole.id });
                          } else {
                            addRole(roleData);
                          }
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4">
                  {roles.map(role => (
                    <Card key={role.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{role.name}</CardTitle>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingRole(role);
                                setIsRoleDialogOpen(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteRole(role.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map(permission => (
                            <Badge key={permission} variant="secondary">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;