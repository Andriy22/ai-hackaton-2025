type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast utility for displaying notifications
 * Uses the Toaster component from UI components
 */
class Toast {
  /**
   * Show a success toast notification
   * @param title - The title of the toast
   * @param options - Additional options for the toast
   */
  success(title: string, options?: ToastOptions) {
    this.show('success', title, options);
  }

  /**
   * Show an error toast notification
   * @param title - The title of the toast
   * @param options - Additional options for the toast
   */
  error(title: string, options?: ToastOptions) {
    this.show('error', title, options);
  }

  /**
   * Show an info toast notification
   * @param title - The title of the toast
   * @param options - Additional options for the toast
   */
  info(title: string, options?: ToastOptions) {
    this.show('info', title, options);
  }

  /**
   * Show a warning toast notification
   * @param title - The title of the toast
   * @param options - Additional options for the toast
   */
  warning(title: string, options?: ToastOptions) {
    this.show('warning', title, options);
  }

  /**
   * Show a toast notification
   * @param type - The type of toast
   * @param title - The title of the toast
   * @param options - Additional options for the toast
   */
  private show(type: ToastType, title: string, options?: ToastOptions) {
    // Get the toast function from window object (set by the Toaster component)
    const toast = (window as any)?.toast;
    
    if (!toast) {
      console.error('Toast function not found. Make sure the Toaster component is mounted.');
      return;
    }

    const { description, duration, action } = options || {};

    toast[type](title, {
      description,
      duration: duration || 5000,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    });
  }
}

export const toast = new Toast();
