import { User } from "@/schema/user";
import { 
  Dropdown, 
  DropdownTrigger, 
  Avatar, 
  DropdownMenu, 
  DropdownItem 
} from "@nextui-org/react";
import { signOut } from "next-auth/react";

export default function Header( { user } : { user: User }  ) {

  return (
    <header className="text-white bg-primary shadow-lg p-4 px-8 py-4 sticky top-0 z-20 flex justify-between items-center">
      <div className="font-bold text-3xl">Psu-Budget</div>
      <div className="flex items-center gap-4">
        <Dropdown>
          <DropdownTrigger>
              <Avatar
                name={user?.firstname}
              />
          </DropdownTrigger>
          <DropdownMenu aria-label="User actions">
            <DropdownItem key="profile">Profile</DropdownItem>
            <DropdownItem key="settings">Settings</DropdownItem>
            <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              onClick={async () => await signOut()}
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div>
            <p>{user?.firstname + " " + user.lastname}</p>
        </div>
      </div>
    </header>
  );
}
