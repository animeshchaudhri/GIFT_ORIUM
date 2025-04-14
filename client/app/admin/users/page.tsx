'use client';

import { useEffect, useState, useRef } from 'react';
import { Loader2, UserCircle, Users as UsersIcon, Pencil, Trash2, AlertCircle, Clock, ShieldCheck, UserPlus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  address?: Address;
}

interface FormData {
  name: string;
  email: string;
  role: string;
  address: Address;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'user',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [userStats, setUserStats] = useState({ total: 0, admin: 0, new30Days: 0 });
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data || []);
      
      // Calculate user statistics
      if (data && data.length > 0) {
        const admins = data.filter((user: User) => user.role === 'admin').length;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsers = data.filter((user: User) => new Date(user.createdAt) >= thirtyDaysAgo).length;
        
        setUserStats({
          total: data.length,
          admin: admins,
          new30Days: newUsers
        });
      }
      
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser && isEditDialogOpen) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        address: {
          street: selectedUser.address?.street || '',
          city: selectedUser.address?.city || '',
          state: selectedUser.address?.state || '',
          zipCode: selectedUser.address?.zipCode || '',
          country: selectedUser.address?.country || '',
        }
      });
      setAvatar(null);
    }
  }, [selectedUser, isEditDialogOpen]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
  };

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    
    if (!selectedUser) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('address', JSON.stringify(formData.address));
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${selectedUser._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      toast({
        title: "User updated",
        description: `Successfully updated ${formData.name}'s information.`,
      });

      await fetchUsers();
      setIsEditDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setDeleteConfirmId(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast({
        title: "User deleted",
        description: "The user has been permanently removed.",
      });

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: err instanceof Error ? err.message : 'An error occurred',
      });
    }
  };

  const addNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', 'temporaryPassword123'); // Temporary password that user must change
      formDataToSend.append('role', formData.role);
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      toast({
        title: "User created",
        description: `Successfully added ${formData.name} as a new user.`,
      });

      await fetchUsers();
      setIsEditDialogOpen(false);
      setFormData({
        name: '',
        email: '',
        role: 'user',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
      setAvatar(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const DeleteConfirmationDialog = ({ id }: { id: string }) => (
    <Dialog open={deleteConfirmId === id} onOpenChange={() => setDeleteConfirmId(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm User Deletion</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this user? This action cannot be undone and will remove all user data from the system.</p>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => deleteUser(id)}>
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const UserDetailsDialog = () => (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar>
                {selectedUser.avatar ? (
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                ) : (
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant={selectedUser.role === 'admin' ? 'default' : 'outline'}>
                    {selectedUser.role === 'admin' ? 'Admin' : 'Customer'}
                  </Badge>
                  <span>·</span>
                  <span>Member since {format(new Date(selectedUser.createdAt), 'PP')}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <a href={`mailto:${selectedUser.email}`} className="text-primary hover:underline">
                    {selectedUser.email}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Created:</span>
                  {format(new Date(selectedUser.createdAt), 'PPpp')}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Address Information</h4>
                {selectedUser.address && (
                  Object.values(selectedUser.address).some(value => value) ? (
                    <div className="space-y-1">
                      {selectedUser.address.street && <p>{selectedUser.address.street}</p>}
                      <p>
                        {selectedUser.address.city && `${selectedUser.address.city}, `}
                        {selectedUser.address.state} {selectedUser.address.zipCode}
                      </p>
                      {selectedUser.address.country && <p>{selectedUser.address.country}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No address on file</p>
                  )
                )}
              </div>
            </div>

            <Separator />
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  setIsEditDialogOpen(true);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit User
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  setDeleteConfirmId(selectedUser._id);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const UserForm = () => (
    <form onSubmit={selectedUser ? updateUser : addNewUser} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            placeholder="Enter user's full name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleFormChange}
            placeholder="Enter user's email"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Customer</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="avatar">Avatar</Label>
          <div className="flex items-center gap-4">
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
            {avatar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAvatar(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <h3 className="text-sm font-medium">Address Information (Optional)</h3>
        
        <div>
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            name="address.street"
            value={formData.address.street}
            onChange={handleFormChange}
            placeholder="Enter street address"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="address.city"
              value={formData.address.city}
              onChange={handleFormChange}
              placeholder="City"
            />
          </div>
          <div>
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              name="address.state"
              value={formData.address.state}
              onChange={handleFormChange}
              placeholder="State/Province"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zipCode">ZIP/Postal Code</Label>
            <Input
              id="zipCode"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleFormChange}
              placeholder="ZIP/Postal Code"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="address.country"
              value={formData.address.country}
              onChange={handleFormChange}
              placeholder="Country"
            />
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsEditDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saveLoading}>
          {saveLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {selectedUser ? 'Update User' : 'Create User'}
        </Button>
      </DialogFooter>
    </form>
  );

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        
        <Dialog open={isEditDialogOpen && !selectedUser} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedUser(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedUser(null);
              setFormData({
                name: '',
                email: '',
                role: 'user',
                address: {
                  street: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  country: ''
                }
              });
              setAvatar(null);
            }}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <UserForm />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{userStats.total}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Admin Users</p>
              <h3 className="text-2xl font-bold">{userStats.admin}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">New Users (30 days)</p>
              <h3 className="text-2xl font-bold">{userStats.new30Days}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {users.length === 0 && !loading && !error ? (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <UsersIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              There are no users in the system yet. Add your first user to get started.
            </p>
            <Button onClick={() => setIsEditDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Your First User
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar>
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          ) : (
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                        {user.role === 'admin' ? 'Admin' : 'Customer'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {format(new Date(user.createdAt), 'PP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => setDeleteConfirmId(user._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isViewDialogOpen && selectedUser && <UserDetailsDialog />}

      <Dialog open={isEditDialogOpen && !!selectedUser} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) setSelectedUser(null);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <UserForm />
        </DialogContent>
      </Dialog>

      {deleteConfirmId && <DeleteConfirmationDialog id={deleteConfirmId} />}
    </div>
  );
}