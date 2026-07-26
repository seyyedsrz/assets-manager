import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">خطایی رخ داد</h1>
            <p className="text-gray-600 mb-6">
              متأسفانه مشکلی پیش آمده است. لطفاً صفحه را refresh کنید.
            </p>
            <Button onClick={() => window.location.reload()}>بارگذاری مجدد</Button>
            {this.state.error && (
              <details className="mt-4 text-right">
                <summary className="text-sm text-gray-500 cursor-pointer">جزئیات خطا</summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-4 rounded-lg overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
