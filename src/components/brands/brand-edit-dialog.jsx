"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/tag-input";
import { useUpdateBrand } from "@/hooks/use-update-brand";
import { useAllBrandTags } from "@/hooks/use-all-brand-tags";

const CATEGORY_OPTIONS = [
  { value: "ECOMMERCE", label: "E-commerce" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "SALON", label: "Salon" },
  { value: "HOTEL", label: "Hotel" },
  { value: "FITNESS", label: "Fitness" },
  { value: "OTHER", label: "Other" },
];

const PROFILE_STATUS_OPTIONS = [
  { value: "SIGNUP_COMPLETED", label: "Signup Completed" },
  { value: "ONBOARDING_COMPLETED", label: "Onboarding Completed" },
  { value: "PROFILE_COMPLETED", label: "Profile Completed" },
];

const APPROVAL_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export function BrandEditDialog({ brand, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    website: "",
    category: "",
    logo: "",
    profileStatus: "SIGNUP_COMPLETED",
    approvalStatus: "PENDING",
    profileCompletionPercentage: 0,
    tags: [],
  });

  const { mutate: updateBrand, isPending } = useUpdateBrand();
  const { data: allTags = [] } = useAllBrandTags();

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        email: brand.email || "",
        phone: brand.phone || "",
        description: brand.description || "",
        website: brand.website || "",
        category: brand.category || "",
        logo: brand.logo || "",
        profileStatus: brand.profileStatus || "SIGNUP_COMPLETED",
        approvalStatus: brand.approvalStatus || "PENDING",
        profileCompletionPercentage: brand.profileCompletionPercentage || 0,
        tags: brand.tags || [],
      });
    }
  }, [brand]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!brand?.id) return;

    const input = {
      name: formData.name,
      email: formData.email,
      description: formData.description,
      website: formData.website,
      category: formData.category,
      logo: formData.logo,
      profileStatus: formData.profileStatus,
      approvalStatus: formData.approvalStatus,
      profileCompletionPercentage:
        parseInt(formData.profileCompletionPercentage) || 0,
      tags: formData.tags,
    };

    updateBrand(
      { id: brand.id, input },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
          <DialogDescription>
            Update brand information and settings
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Basic Information
            </h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Brand name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contact@brand.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Phone</Label>
                <div className="text-sm py-2 px-3 bg-muted rounded-md">
                  {formData.phone || <span className="text-muted-foreground">Not provided</span>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Brief description about the brand"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Business Details
            </h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://www.brand.com"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={formData.logo}
                  onChange={(e) => handleInputChange("logo", e.target.value)}
                  placeholder="https://cdn.example.com/logo.png"
                />
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Status Management
            </h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="profileStatus">Profile Status</Label>
                <Select
                  value={formData.profileStatus}
                  onValueChange={(value) =>
                    handleInputChange("profileStatus", value)
                  }
                >
                  <SelectTrigger id="profileStatus">
                    <SelectValue placeholder="Select profile status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFILE_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="approvalStatus">Approval Status</Label>
                <Select
                  value={formData.approvalStatus}
                  onValueChange={(value) =>
                    handleInputChange("approvalStatus", value)
                  }
                >
                  <SelectTrigger id="approvalStatus">
                    <SelectValue placeholder="Select approval status" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPROVAL_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="profileCompletionPercentage">
                  Profile Completion (%)
                </Label>
                <Input
                  id="profileCompletionPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.profileCompletionPercentage}
                  onChange={(e) =>
                    handleInputChange(
                      "profileCompletionPercentage",
                      e.target.value,
                    )
                  }
                  placeholder="0-100"
                />
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tags</h3>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <TagInput
                value={formData.tags}
                onChange={(tags) => handleInputChange("tags", tags)}
                suggestions={allTags}
                placeholder="Add tags (e.g., hair spa, facial, cuisines)..."
              />
              <p className="text-sm text-muted-foreground">
                Add relevant tags to categorize the brand
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
