
import { useState } from "react";
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export const Header = ({ onSearch }: { onSearch?: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl md:text-2xl">MRG RESTAU</span>
          </Link>
        </div>
        
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <Button variant="outline" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="grid gap-6 py-6">
              <div className="space-y-3">
                <Link to="/" className="block text-lg font-medium">
                  Accueil
                </Link>
                <Link to="/menu" className="block text-lg font-medium">
                  Menu
                </Link>
                <Link to="/about" className="block text-lg font-medium">
                  À propos
                </Link>
                <Link to="/cuisine" className="block text-lg font-medium">
                  Cuisine
                </Link>
              </div>
              {onSearch && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Rechercher un plat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center justify-between w-full">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Accueil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/menu">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Menu
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    À propos
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/cuisine">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Cuisine
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {onSearch && (
            <div className="flex gap-2 ml-auto">
              <Input
                placeholder="Rechercher un plat..."
                className="w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
