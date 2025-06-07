import { getProfile,changeProfile,deleteProfile } from "./api/profile"
import  { useState,useEffect } from 'react';
import { useQuery,useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./context/useauth";
import Navbar from "./Navbar";
import './profilepage.css'

type Anyuser= {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    
  };
type Props = {
  User: Anyuser;
  onEdit: (field: keyof Anyuser) => void;
  onDelete: () => void;
};
const dummyUser = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'john@example.com',
  phone: '123-456-7890',
};
const UserProfile: React.FC<Props> = ({ User, onEdit, onDelete }) => {
  return (
    
    <div className="user-profile">
      
      <h2 className="profile-title">User Profile</h2>

      <div className="profile-fields">
        <div className="profile-field">
          <span><strong>First Name:</strong> {User.firstname}</span>
          <button onClick={() => onEdit('firstname')} className="edit-link">Edit</button>
        </div>

        <div className="profile-field">
          <span><strong>Last Name:</strong> {User.lastname}</span>
          <button onClick={() => onEdit('lastname')} className="edit-link">Edit</button>
        </div>

        <div className="profile-field">
          <span><strong>Email:</strong> {User.email}</span>
          <button onClick={() => onEdit('email')} className="edit-link">Edit</button>
        </div>

        <div className="profile-field">
          <span><strong>Phone:</strong> {User.phone}</span>
          <button onClick={() => onEdit('phone')} className="edit-link">Edit</button>
        </div>
       
      </div>
      <div className="profile-field">
        <button
          onClick={onDelete}
          className="delete-button"
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
};


function ProfilePage(){
    const [user, setUser] = useState<Anyuser>(dummyUser);
    const [editingField, setEditingField] = useState<keyof Anyuser | null>(null);
    const [tempValue, setTempValue] = useState('');
    const { logout } = useAuth();
    const queryClient = useQueryClient();


    const {
      data: fetchedUser,
      isLoading,
      error,
    } = useQuery({
      queryKey: ['myuser'],
      queryFn: () => getProfile(),
      staleTime: 1000 * 60 * 5,
    });
    
    useEffect(() => {
        if (fetchedUser) {
            setUser(fetchedUser);
        }
        }, [fetchedUser]);
  
    if (isLoading) return <p>Loading...</p>;
    if (error instanceof Error) return <p>{error.message}</p>;
    if (!user) return <p>No user to display</p>;



const handleEdit = (field: keyof Anyuser) => {
  setEditingField(field);
  setTempValue(user[field]);
};

const handleSave = async () => {
  if (!editingField) return;
  const updatedFields: Partial<Anyuser> = {
    [editingField]: tempValue,
  };

  try {
    
    const response=await changeProfile(updatedFields); 
    setUser(prev => ({ ...prev, ...updatedFields }));
    setEditingField(null);
    queryClient.invalidateQueries({ queryKey: ['myuser'] });
    alert(`success: ${response}`)
    
  } catch (error) {
    if (error instanceof Error) {
      alert(`Failed to update: ${error.message}`);
    }
  }
};

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account?');
    if (!confirmed) return;
    try {
        const status = await Promise.all([
          deleteProfile(),
          logout()
        ]);
        
    } catch (error:any) {
        alert(`Delete failed: ${error.message}`);
    }
  };

    return(<>
     <div className="page-container">
      <Navbar />
      <main className="content-container">
        <div className="profile-card">
          {editingField ? (
            <div className="edit-form">
              <h3 className="edit-heading">Editing {editingField}</h3>
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="edit-input"
              />
              <div className="button-group">
                <button onClick={handleSave} className="save-button">Save</button>
                <button onClick={() => setEditingField(null)} className="cancel-button">Cancel</button>
              </div>
            </div>
          ) : (
            <UserProfile User={user} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </div></>)
}
export default ProfilePage



