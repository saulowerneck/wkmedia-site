import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Loja from "@/pages/Loja";
import Produto from "@/pages/Produto";
import Checkout from "@/pages/Checkout";
import Pedido from "@/pages/Pedido";
import Trocas from "@/pages/Trocas";
import { CartProvider } from "./contexts/CartContext";
import { CatalogProvider } from "./contexts/CatalogContext";
import Admin from "@/pages/Admin";
import CartDrawer from "./components/shop/CartDrawer";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/privacidade"} component={PrivacyPolicy} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/loja"} component={Loja} />
      <Route path={"/loja/:slug"} component={Produto} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/pedido/:status"} component={Pedido} />
      <Route path={"/trocas-e-devolucoes"} component={Trocas} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <CatalogProvider>
            <CartProvider>
              <Toaster />
              <Router />
              <CartDrawer />
            </CartProvider>
          </CatalogProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
