import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountLayout from './Account/AccountLayout';

const Account: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login?redirect=/account" replace />;
  }

  return (
    <PageContainer disablePadding={true}>
      <div className="pt-[72px] bg-background">
        <AccountLayout />
      </div>
    </PageContainer>
  );
};

export default Account;
