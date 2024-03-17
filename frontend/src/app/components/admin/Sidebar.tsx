// app/components/AdminSidebar.tsx
import { useRouter } from 'next/navigation';

interface MenuItem {
  label: string;
  path: string;
}

interface MenuGroup {
  label: string;
  paths: MenuItem[];
}

export default function Sidebar() {
  const router = useRouter();
  const menus: MenuGroup[] = [
    {
      label: "Users",
      paths: [
        {
          label: "Table View",
          path: "/admin/users"
        },
        {
          label: "Register",
          path: "/admin/users/register"
        }
      ]
    },
    {
      label: "Database",
      paths: [
        {
          label: "Import",
          path: "/admin/db/import"
        },
        {
          label: "Export",
          path: "/admin/db/export"
        }
      ]
    }
  ];

  return (
    <aside className="bg-gray-900 text-white min-h-screen fixed w-64">
      <div className="p-6">
        {menus.map((group, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold mb-3">{group.label}</h3>
            <ul className="space-y-2">
              {group.paths.map((path, i) => (
                <li 
                  onClick={() => router.push(path.path)} 
                  key={i} 
                  className="text-gray-500 hover:text-white transition duration-300 ease-in-out"
                >
                  {path.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
