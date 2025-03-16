import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ 
  open, 
  onOpenChange, 
  children 
}) => {
  if (!open) return null;
  
  // Add a click handler to the overlay to close the dialog when clicked outside
  const handleOverlayClick = () => {
    onOpenChange(false);
  };
  
  return (
    <AlertDialogPortal>
      <div onClick={handleOverlayClick}>
        <AlertDialogOverlay />
      </div>
      {children}
    </AlertDialogPortal>
  );
};

interface AlertDialogPortalProps {
  children: React.ReactNode;
}

const AlertDialogPortal: React.FC<AlertDialogPortalProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {children}
    </div>
  );
};

interface AlertDialogOverlayProps {
  className?: string;
}

const AlertDialogOverlay: React.FC<AlertDialogOverlayProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
    />
  );
};

interface AlertDialogContentProps {
  className?: string;
  children: React.ReactNode;
}

const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface AlertDialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface AlertDialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface AlertDialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ className, children, ...props }) => {
  return (
    <h2
      className={cn("text-lg font-semibold", className)}
      {...props}
    >
      {children}
    </h2>
  );
};

interface AlertDialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ className, children, ...props }) => {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
};

interface AlertDialogActionProps {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ className, children, asChild, ...props }) => {
  if (asChild) {
    return <>{children}</>;
  }
  
  return (
    <Button
      className={cn(className)}
      {...props}
    >
      {children}
    </Button>
  );
};

interface AlertDialogCancelProps {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ className, children, asChild, ...props }) => {
  if (asChild) {
    return <>{children}</>;
  }
  
  return (
    <Button
      variant="outline"
      className={cn(
        "mt-2 sm:mt-0",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

const AlertDialogTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ 
  asChild, 
  children 
}) => {
  if (asChild) {
    return <>{children}</>;
  }
  
  return <>{children}</>;
};

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
