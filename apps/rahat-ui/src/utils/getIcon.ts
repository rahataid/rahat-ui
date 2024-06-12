import * as li from "lucide-react";


type IconComponent = React.ForwardRefExoticComponent<li.LucideProps & React.RefAttributes<SVGSVGElement>>;

export default function getIcon(name: string): IconComponent {
    const iconName = name as keyof typeof li;
    const icon = li[iconName];

    return icon ? (icon as IconComponent) : li.Book as IconComponent
}
