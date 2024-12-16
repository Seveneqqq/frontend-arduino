import React, { useState, useEffect, useRef } from 'react';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import { Toast } from 'primereact/toast';

export default function AccountTab() {
  const toast = useRef(null);
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const fetchAccountInfo = async() => {
    try {
      let response = await fetch(`http://localhost:4000/api/account/${sessionStorage.getItem('UserId')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
        },
      });
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load user data',
        life: 3000
      });
    }
  };

  const handleLeaveHome = async (home_id) => {
    try {
      const response = await fetch('http://localhost:4000/api/account/leave-home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
        },
        body: JSON.stringify({
          home_id: home_id,
          user_id: sessionStorage.getItem('UserId')
        })
      });
  
      if (response.ok) {
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully left the home',
          life: 3000
        });
        fetchAccountInfo();
      } else {
        const errorData = await response.json();
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: errorData.error || 'Failed to leave home',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to leave home',
        life: 3000
      });
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== repeatPassword) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'New passwords do not match',
        life: 3000
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/account/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          user_id: sessionStorage.getItem('UserId')
        })
      });

      if (response.ok) {
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Password changed successfully',
          life: 3000
        });
        setVisible(false);
        setCurrentPassword('');
        setNewPassword('');
        setRepeatPassword('');
      } else {
        const errorData = await response.json();
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: errorData.error || 'Failed to change password',
          life: 3000
        });
      }
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to change password',
        life: 3000
      });
    }
  };

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  if (!data) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col py-5 gap-6 max-w-3xl mx-auto">
      <Toast ref={toast} />
      <div className="bg-[#1E1E1C] rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">User</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Name</span>
              <div className="flex items-center gap-2">
                {data.login}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Email</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {data.email}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Password</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button label="Change" size='small' icon="pi pi-lock" className="mt-2" onClick={() => setVisible(true)}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog 
        header="Change password" 
        visible={visible} 
        style={{ width: '300px' }} 
        onHide={() => {
          if (!visible) return;
          setVisible(false);
          setCurrentPassword('');
          setNewPassword('');
          setRepeatPassword('');
        }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
      >
        <div className='flex flex-col gap-6 w-full items-center'>
          <FloatLabel>
            <Password 
              inputId="currentPassword" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              toggleMask 
              feedback={false}
              className="w-full"
            />
            <label htmlFor="currentPassword">Current password</label>
          </FloatLabel>
          <FloatLabel>
            <Password 
              inputId="newPassword" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              toggleMask
              className="w-full"
            />
            <label htmlFor="newPassword">New password</label>
          </FloatLabel>
          <FloatLabel>
            <Password 
              inputId="repeatPassword" 
              value={repeatPassword} 
              onChange={(e) => setRepeatPassword(e.target.value)} 
              toggleMask 
              feedback={false}
              className="w-full"
            />
            <label htmlFor="repeatPassword">Repeat password</label>
          </FloatLabel>

          <Button label="Save" className='w-[90%]' onClick={handlePasswordChange}/>
        </div>
      </Dialog>

      <div className="bg-[#1E1E1C] rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">My Homes</h2>
          <div className="space-y-4">
            {data.homes.map((home) => (
              <div key={home.home_id} className="rounded-lg p-4 bg-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-4 mb-2 justify-between">
                      <h3 className="text-lg font-medium">{home.name}</h3>
                      {home.owner_id === parseInt(sessionStorage.getItem('UserId')) && (
                        <span className="text-xs bg-[#CB50CB] text-white px-2 py-1 rounded">Owner</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Invite Code:</span>
                      <span className="text-sm bg-[#151513] px-2 py-1 rounded">{home.home_invite_code}</span>
                      <Button 
                        icon="pi pi-copy" 
                        className="p-button-text p-button-sm p-0 bg-transparent" 
                        onClick={() => {
                          navigator.clipboard.writeText(home.home_invite_code);
                          toast.current.show({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Invite code copied to clipboard',
                            life: 2000
                          });
                        }}
                      />
                    </div>
                  </div>
                  {home.owner_id !== parseInt(sessionStorage.getItem('UserId')) && (
                    <Button
                      icon="pi pi-sign-out"
                      className="p-button-danger p-button-text p-button-sm"
                      tooltip="Leave Home"
                      onClick={() => handleLeaveHome(home.home_id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}