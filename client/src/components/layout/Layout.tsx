import Footer from "./Footer";
import { Navbar } from "./Navbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;