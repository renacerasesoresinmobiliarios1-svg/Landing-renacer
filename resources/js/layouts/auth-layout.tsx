import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayoutTemplate title="" description="">
            {/* ELIMINAMOS CUALQUIER RASTRO DE LARAVEL */}
            <style dangerouslySetInnerHTML={{ __html: `
                header, [data-slot="logo"], svg, .mb-4, nav { display: none !important; }
                .auth-simple-layout-content { 
                    max-width: 100% !important; 
                    width: 100% !important; 
                    padding: 0 !important; 
                    margin: 0 !important; 
                }
            ` }} />
            {children}
        </AuthLayoutTemplate>
    );
}