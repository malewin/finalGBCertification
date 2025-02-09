import React from 'react';
import Profile from './Profile';

const ProfileRoute = ({ userName, onAvatarChange }) => {
    return <Profile userName={userName} onAvatarChange={onAvatarChange} />;
};

export default ProfileRoute;