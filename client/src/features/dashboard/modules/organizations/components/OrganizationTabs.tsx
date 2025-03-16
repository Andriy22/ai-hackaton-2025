import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, UserRound, BarChart } from 'lucide-react';

interface OrganizationTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const OrganizationTabs = ({
  children,
  defaultValue = 'users',
  onChange,
}: OrganizationTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Users</span>
        </TabsTrigger>
        <TabsTrigger value="employees" className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          <span>Employees</span>
        </TabsTrigger>
        <TabsTrigger value="statistics" className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          <span>Statistics</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export const OrganizationTabContent = TabsContent;
