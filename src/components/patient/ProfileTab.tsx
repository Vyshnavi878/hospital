import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, UserRound, Phone, Mail, ShieldAlert, Heart, MapPin, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfileTab = () => {
  const { toast } = useToast();
  const initialUsername = localStorage.getItem("username") || "Sarah Johnson";

  const [profile, setProfile] = useState({
    full_name: initialUsername,
    email: "sarah.johnson@example.com",
    mobile: "+91 98765 43210",
    age: 29,
    gender: "female",
    blood_group: "O+",
    emergency_contact: "+91 98111 22233",
    address: "Apt 4B, Palm Grove Residences, Mumbai",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("username", profile.full_name);
    toast({
      title: "Profile Updated Successfully",
      description: "Your patient information and emergency contacts have been saved.",
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-heading">Personal & Medical Profile</CardTitle>
              <p className="text-xs text-muted-foreground">Manage your identity and hospital contact records</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-5">
            {/* Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="text-xs font-semibold">Full Legal Name</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="h-9 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                <Input
                  id="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="h-9 text-sm"
                  type="email"
                  required
                />
              </div>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="mobile" className="text-xs font-semibold">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={profile.mobile}
                  onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                  className="h-9 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="age" className="text-xs font-semibold">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                  className="h-9 text-sm"
                  min={1}
                  max={120}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Gender</Label>
                <Select value={profile.gender} onValueChange={(v) => setProfile({ ...profile, gender: v })}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Medical Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-rose-500" /> Blood Group
                </Label>
                <Select value={profile.blood_group} onValueChange={(v) => setProfile({ ...profile, blood_group: v })}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="emergency_contact" className="text-xs font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> Emergency Hotline Contact
                </Label>
                <Input
                  id="emergency_contact"
                  value={profile.emergency_contact}
                  onChange={(e) => setProfile({ ...profile, emergency_contact: e.target.value })}
                  className="h-9 text-sm"
                  placeholder="Relative or guardian phone"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs font-semibold flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Residential Address
              </Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="h-9 text-sm"
              />
            </div>

            <Button type="submit" className="gap-2 shadow-sm font-medium">
              <Save className="h-4 w-4" />
              Save Profile Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
