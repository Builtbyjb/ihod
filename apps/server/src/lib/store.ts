type Plans = {
    features: string[];
    cta: string;
    featured: boolean;
    disabled: boolean;
};

export const plans: Record<string, Plans> = {
    PLN_2zz8jgorepk0t2n: {
        // Pro plan
        features: ["Unlimited invoices", "All premium templates", "Automatic reminders", "Priority support"],
        cta: "Get Pro Plan",
        featured: true,
        disabled: false,
    },
    PLN_naa6o3ymymu5un8: {
        // Team plan
        features: [
            "Everything in Pro",
            "Up to 5 team members",
            "Team collaboration",
            "Custom branding",
            "Dedicated support",
        ],
        cta: "Contact sales",
        featured: false,
        disabled: true,
    },
};

export const freePlan = {
    id: 0,
    planCode: "PLN_free",
    name: "Free",
    amount: 0,
    currency: "NGN",
    interval: "monthly",
    description: "Perfect for getting started",
    features: ["Up to 3 invoices per month", "Basic templates", "Email support", "PDF downloads"],
    cta: "Get started for free",
    featured: false,
    disabled: false,
};
