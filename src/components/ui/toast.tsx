import { toast as sonnerToast } from 'sonner';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/utils/utils';

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

const toastStyles = {
  success: {
    icon: <CheckCircle2 className="size-5 text-[#39D0A4]" />,
    className: 'border-[#39D0A4]/20 bg-[#39D0A4]/5',
  },
  error: {
    icon: <XCircle className="size-5 text-[#FF4D4D]" />,
    className: 'border-[#FF4D4D]/20 bg-[#FF4D4D]/5',
  },
  warning: {
    icon: <AlertCircle className="size-5 text-[#FFB020]" />,
    className: 'border-[#FFB020]/20 bg-[#FFB020]/5',
  },
  info: {
    icon: <Info className="size-5 text-[#6060D0]" />,
    className: 'border-[#6060D0]/20 bg-[#6060D0]/5',
  },
};

export const toast = {
  success: ({ title, description, action }: ToastProps) => {
    return sonnerToast.custom(
      (id) => (
        <div
          className={cn(
            'flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300',
            toastStyles.success.className,
            'translate-x-0 opacity-100'
          )}
        >
          {toastStyles.success.icon}
          <div className="flex-1">
            {title && (
              <p className="font-semibold text-[#0A2540] dark:text-white">
                {title}
              </p>
            )}
            {description && (
              <p className="mt-1 text-sm text-[#425466] dark:text-[#8E98A3]">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      ),
      {
        duration: 4000,
        position: 'top-right',
      }
    );
  },

  error: ({ title, description, action }: ToastProps) => {
    return sonnerToast.custom(
      (id) => (
        <div
          className={cn(
            'flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300',
            toastStyles.error.className,
            'translate-x-0 opacity-100'
          )}
        >
          {toastStyles.error.icon}
          <div className="flex-1">
            {title && (
              <p className="font-semibold text-[#0A2540] dark:text-white">
                {title}
              </p>
            )}
            {description && (
              <p className="mt-1 text-sm text-[#425466] dark:text-[#8E98A3]">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      ),
      {
        duration: 5000,
        position: 'top-right',
      }
    );
  },

  warning: ({ title, description, action }: ToastProps) => {
    return sonnerToast.custom(
      (id) => (
        <div
          className={cn(
            'flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300',
            toastStyles.warning.className,
            'translate-x-0 opacity-100'
          )}
        >
          {toastStyles.warning.icon}
          <div className="flex-1">
            {title && (
              <p className="font-semibold text-[#0A2540] dark:text-white">
                {title}
              </p>
            )}
            {description && (
              <p className="mt-1 text-sm text-[#425466] dark:text-[#8E98A3]">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      ),
      {
        duration: 4000,
        position: 'top-right',
      }
    );
  },

  info: ({ title, description, action }: ToastProps) => {
    return sonnerToast.custom(
      (id) => (
        <div
          className={cn(
            'flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300',
            toastStyles.info.className,
            'translate-x-0 opacity-100'
          )}
        >
          {toastStyles.info.icon}
          <div className="flex-1">
            {title && (
              <p className="font-semibold text-[#0A2540] dark:text-white">
                {title}
              </p>
            )}
            {description && (
              <p className="mt-1 text-sm text-[#425466] dark:text-[#8E98A3]">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      ),
      {
        duration: 3000,
        position: 'top-right',
      }
    );
  },
}; 