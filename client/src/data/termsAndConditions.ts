// Terms and Conditions data for event registration
export interface TermsData {
  title: string;
  lastUpdated: string;
  sections: TermsSection[];
}

export interface TermsSection {
  heading: string;
  content: string[];
}

export const termsAndConditions: TermsData = {
  title: "Terms and Conditions",
  lastUpdated: "2024-01-01",
  sections: [
    {
      heading: "Event Registration",
      content: [
        "By registering for this event, you acknowledge that you have read, understood, and agree to these terms and conditions.",
        "Registration is subject to availability and may be limited based on event capacity.",
        "The event organizers reserve the right to modify or cancel the event due to unforeseen circumstances."
      ]
    },
    {
      heading: "Participant Requirements",
      content: [
        "All participants must meet the age and skill level requirements specified for their chosen category.",
        "Participants must provide accurate and complete information during registration.",
        "Parental consent is required for participants under the age of 18."
      ]
    },
    {
      heading: "Liability and Safety",
      content: [
        "Participants acknowledge that they participate in the event at their own risk.",
        "The event organizers are not liable for any injuries, accidents, or damages that may occur during the event.",
        "Participants must follow all safety guidelines and instructions provided by event staff."
      ]
    },
    {
      heading: "Privacy and Data Protection",
      content: [
        "Your personal information will be collected and processed in accordance with our Privacy Policy.",
        "Information provided during registration will be used solely for event management purposes.",
        "We will not share your personal information with third parties without your explicit consent."
      ]
    },
    {
      heading: "Cancellation and Refunds",
      content: [
        "Cancellation policies and refund eligibility are subject to the specific event terms.",
        "Event organizers reserve the right to modify or cancel events due to weather, safety, or other concerns.",
        "In case of event cancellation, participants will be notified and refund policies will apply."
      ]
    },
    {
      heading: "Code of Conduct",
      content: [
        "All participants must behave respectfully and follow event rules and regulations.",
        "Any disruptive or inappropriate behavior may result in removal from the event without refund.",
        "Participants are expected to maintain a positive and inclusive environment for all attendees."
      ]
    }
  ]
};

export const privacyPolicy: TermsData = {
  title: "Privacy Policy",
  lastUpdated: "2024-01-01",
  sections: [
    {
      heading: "Information We Collect",
      content: [
        "We collect information you provide during registration including name, email, parent contact details, grade, and skill level.",
        "This information is necessary for event management and participant communication.",
        "We do not collect unnecessary personal information beyond what is required for event participation."
      ]
    },
    {
      heading: "How We Use Your Information",
      content: [
        "Your information is used to process your event registration and manage your participation.",
        "We may use your contact information to send important event updates and notifications.",
        "Your information helps us ensure appropriate event planning and safety measures."
      ]
    },
    {
      heading: "Information Security",
      content: [
        "We implement appropriate security measures to protect your personal information.",
        "Your data is stored securely and accessed only by authorized personnel.",
        "We regularly review and update our security practices to maintain data protection."
      ]
    },
    {
      heading: "Data Retention",
      content: [
        "We retain your information only for as long as necessary to fulfill the purposes outlined in this policy.",
        "Event-related information is typically retained for one year after the event completion.",
        "You may request deletion of your personal information at any time."
      ]
    }
  ]
};

// Export default for easy importing
export default {
  termsAndConditions,
  privacyPolicy
};
