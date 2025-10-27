import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/asset";
import { User, Users, Building } from "lucide-react";

interface RoleSwitchProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitch = ({ currentRole, onRoleChange }: RoleSwitchProps) => {
  const roles: { role: UserRole; label: string; icon: typeof User }[] = [
    { role: 'technician', label: 'Technician', icon: User },
    { role: 'manager', label: 'Manager', icon: Users },
    { role: 'executive', label: 'Executive', icon: Building },
  ];

  return (
    <div className="flex gap-2 p-1 bg-secondary rounded-lg">
      {roles.map(({ role, label, icon: Icon }) => (
        <Button
          key={role}
          variant={currentRole === role ? "default" : "ghost"}
          size="sm"
          onClick={() => onRoleChange(role)}
          className="gap-2"
        >
          <Icon className="w-4 h-4" />
          {label}
        </Button>
      ))}
    </div>
  );
};
