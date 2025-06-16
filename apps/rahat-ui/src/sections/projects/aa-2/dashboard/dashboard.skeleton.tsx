import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Users, Home } from 'lucide-react';

// Custom shimmer component for enhanced loading effect
const ShimmerBox = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded ${className}`}
  />
);

export default function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Top Section with Main Metrics and Project Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Main Metrics */}
        <div className=" space-y-4">
          <Card className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Beneficiaries
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                <ShimmerBox className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Household Receiving Cash Support
              </CardTitle>
              <Home className="h-4 w-4 text-blue-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                <ShimmerBox className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right - Project Information */}
        <Card className="animate-pulse">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-gray-500 mb-1">Project Status</div>
                <ShimmerBox className="h-3 w-16" />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Type</div>
                <ShimmerBox className="h-4 w-6" />
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-gray-500 mb-1">Location</div>
                <ShimmerBox className="h-4 w-20" />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Hazard Type</div>
                <ShimmerBox className="h-4 w-16" />
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">River Basin</div>
              <ShimmerBox className="h-4 w-16" />
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">
                Project Description
              </div>
              <ShimmerBox className="h-4 w-full mb-1" />
              <ShimmerBox className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid - 2 rows x 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Row 1 */}
        {/* Cash Supported Households by Gender */}
        <Card className="animate-pulse">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Cash Supported Households by Gender
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-200 via-teal-200 to-green-200 animate-spin-slow"></div>
                <div className="absolute inset-4 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-center space-x-4 text-xs">
              <div className="flex items-center space-x-1 animate-pulse">
                <div className="w-2 h-2 bg-teal-200 rounded-full animate-ping"></div>
                <span className="text-gray-600">MALE</span>
              </div>
              <div className="flex items-center space-x-1 animate-pulse">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-ping"></div>
                <span className="text-gray-600">UNKNOWN</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vulnerability Status */}
        <Card className="animate-pulse">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Vulnerability Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-4">
              <ShimmerBox className="h-8 w-8" />
            </div>
            <div className="space-y-4">
              <div className="justify-center items-center gap-2 flex flex-row">
                <ShimmerBox className="h-4 w-16 mx-auto" />
                <div className="w-full bg-gray-200 rounded-full h-4 animate-pulse">
                  <div
                    className="bg-blue-400 h-4 rounded-full animate-pulse"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
              <div className="justify-center items-center gap-2 flex flex-row">
                <ShimmerBox className="h-4 w-16 mx-auto" />
                <div className="w-full bg-gray-200 rounded-full h-4 animate-pulse">
                  <div
                    className="bg-blue-400 h-4 rounded-full animate-pulse"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Beneficiary Associated Bank */}
        <Card className="animate-pulse">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Beneficiary Associated Bank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-4">
              <ShimmerBox className="h-8 w-8" />
            </div>
            <div className="space-y-4">
              <div className="justify-center items-center gap-2 flex flex-row">
                <ShimmerBox className="h-4 w-16 mx-auto" />
                <div className="w-full bg-gray-200 rounded-full h-4 animate-pulse">
                  <div
                    className="bg-blue-400 h-4 rounded-full animate-pulse"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
              <div className="justify-center items-center gap-2 flex flex-row">
                <ShimmerBox className="h-4 w-16 mx-auto" />
                <div className="w-full bg-gray-200 rounded-full h-4 animate-pulse">
                  <div
                    className="bg-blue-400 h-4 rounded-full animate-pulse"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Row 2 */}
        {/* Household Phone Availability */}
        <Card className="animate-pulse">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Household Phone Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <div className=" h-32 rounded-full bg-gray-300 animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center animate-pulse">
                    <div className="text-xs text-gray-500">Total</div>
                    <ShimmerBox className="h-6 w-6 mx-auto mb-1" />
                    <ShimmerBox className="h-3 w-12 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4 text-xs">
              <div className="flex items-center space-x-1 animate-pulse">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-ping"></div>
                <span className="text-gray-600">Phoned</span>
              </div>
              <div className="flex items-center space-x-1 animate-pulse">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                <span className="text-gray-600">UnPhoned</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Household Bank Status */}
        <Card className="animate-pulse">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Household Bank Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <div className="w-32 h-32 rounded-full bg-gray-300 animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center animate-pulse">
                    <div className="text-xs text-gray-500">Total</div>
                    <ShimmerBox className="h-6 w-6 mx-auto mb-1" />
                    <ShimmerBox className="h-3 w-12 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4 text-xs">
              <div className="flex items-center space-x-1 animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-gray-600">Banked</span>
              </div>
              <div className="flex items-center space-x-1 animate-pulse">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                <span className="text-gray-600">Unbanked</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Type of Phone */}
        <Card className="animate-pulse">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Type of Phone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <div className="w-32 h-32 rounded-full bg-gray-300 animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center animate-pulse">
                    <div className="text-xs text-gray-500">Total</div>
                    <ShimmerBox className="h-6 w-6 mx-auto mb-1" />
                    <ShimmerBox className="h-3 w-12 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4 text-xs">
              <div className="flex items-center space-x-1 animate-pulse">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-ping"></div>
                <span className="text-gray-600">Smart_Phone_Set</span>
              </div>
              <div className="flex items-center space-x-1 animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-gray-600">Simple_Mobile_Set</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
