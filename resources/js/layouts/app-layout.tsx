import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import {toast, Toaster} from "sonner";
import {usePage} from "@inertiajs/react";
import {useEffect, useRef} from "react";
import {AudioPlayerProvider} from "@/context/audio-context";
interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {

    const mountedRef = useRef();

    const page = usePage();
    // @ts-ignore
    const message = page.props.flash?.message;

    useEffect(() => {
        let timerId;

        if (!mountedRef.current) {
            setTimeout(() => {
                if (message != undefined) {
                    toast.success(message);
                }
            });
        }

        mountedRef.current = true;

        return () => {
            clearTimeout(timerId);
        };
    }, []);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <AudioPlayerProvider>
                {children}
            </AudioPlayerProvider>
            <Toaster />
        </AppLayoutTemplate>
    )
};