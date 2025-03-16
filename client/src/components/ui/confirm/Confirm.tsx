import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmProps {
  /**
   * Title of the confirmation dialog
   */
  title?: string;
  /**
   * Description or message for the confirmation
   */
  message: string;
  /**
   * Text for the confirm button
   */
  confirmText?: string;
  /**
   * Text for the cancel button
   */
  cancelText?: string;
  /**
   * Variant for the confirm button
   */
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /**
   * Variant for the cancel button
   */
  cancelVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /**
   * Icon to display in the confirm button
   */
  confirmIcon?: ReactNode;
  /**
   * Function to call when confirmed
   */
  onConfirm: () => void | Promise<void>;
  /**
   * Function to call when canceled
   */
  onCancel?: () => void;
  /**
   * Whether the dialog is open
   */
  open: boolean;
  /**
   * Function to set the open state
   */
  setOpen: (open: boolean) => void;
}

export const Confirm = ({
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "destructive",
  cancelVariant = "outline",
  confirmIcon,
  onConfirm,
  onCancel,
  open,
  setOpen,
}: ConfirmProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        onKeyDown={handleKeyDown}
        aria-describedby="confirm-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription id="confirm-dialog-description">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant={cancelVariant}
            onClick={handleCancel}
            disabled={isLoading}
            tabIndex={0}
            aria-label={cancelText}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            tabIndex={0}
            aria-label={confirmText}
            className="inline-flex items-center"
          >
            {isLoading ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              confirmIcon && <span className="mr-2">{confirmIcon}</span>
            )}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
