import { useState } from 'react'
import {
  CreditCard,
  FileCheck,
  MapPin,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react'
import { loadObject, saveObject } from '../utils/storage.js'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']
const SEX_OPTIONS = ['Female', 'Male', 'Intersex', 'Prefer not to say']
const RELATIONSHIPS = ['Parent', 'Spouse', 'Partner', 'Sibling', 'Friend', 'Other']
const inputClasses =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'

const DEFAULT_PROFILE = {
  firstName: '',
  lastName: '',
  preferredName: '',
  dateOfBirth: '',
  sex: '',
  bloodType: '',
  height: '',
  weight: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  insuranceStatus: 'insured',
  insuranceProvider: '',
  memberId: '',
  groupNumber: '',
  policyHolderName: '',
  emergencyName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
  emergencyEmail: '',
  legalName: '',
  consentTreatment: false,
  consentPrivacy: false,
}

function Field({ label, required = false, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}{' '}
        {required ? <span className="text-red-500">*</span> : <span className="font-normal text-gray-400">(optional)</span>}
      </label>
      {children}
    </div>
  )
}

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="border-b border-gray-100 pb-7 last:border-0 last:pb-0">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon size={18} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function Profile() {
  const [formData, setFormData] = useState(() => ({
    ...DEFAULT_PROFILE,
    ...loadObject('medicare.profile', {}),
  }))
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 400))
    saveObject('medicare.profile', formData)
    setIsSaving(false)
    setSaved(true)
  }

  return (
    <div className="pb-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <UserRound size={23} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Patient Profile</h1>
            <p className="text-sm text-gray-500">Complete your enrollment details for safer, smoother care.</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500"><span className="text-red-500">*</span> Required for enrollment. Optional details can be added later.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-7 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <Section icon={UserRound} title="Patient Identification" description="Use your legal details to prevent duplicate or mixed records.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Legal first name" required><input required value={formData.firstName} onChange={handleChange('firstName')} className={inputClasses} autoComplete="given-name" /></Field>
            <Field label="Legal last name" required><input required value={formData.lastName} onChange={handleChange('lastName')} className={inputClasses} autoComplete="family-name" /></Field>
            <Field label="Preferred name"><input value={formData.preferredName} onChange={handleChange('preferredName')} className={inputClasses} autoComplete="nickname" /></Field>
            <Field label="Date of birth" required><input required type="date" value={formData.dateOfBirth} onChange={handleChange('dateOfBirth')} className={inputClasses} /></Field>
            <Field label="Sex" required><select required value={formData.sex} onChange={handleChange('sex')} className={inputClasses}><option value="">Select...</option>{SEX_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></Field>
            <Field label="Blood type"><select value={formData.bloodType} onChange={handleChange('bloodType')} className={inputClasses}><option value="">Not provided</option>{BLOOD_TYPES.map((type) => <option key={type}>{type}</option>)}</select></Field>
            <Field label="Height (cm)"><input type="number" min="0" value={formData.height} onChange={handleChange('height')} placeholder="e.g. 170" className={inputClasses} /></Field>
            <Field label="Weight (kg)"><input type="number" min="0" value={formData.weight} onChange={handleChange('weight')} placeholder="e.g. 65" className={inputClasses} /></Field>
          </div>
        </Section>

        <Section icon={MapPin} title="Contact Information" description="Used for reminders, telehealth links, and follow-up care.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email address" required><input required type="email" value={formData.email} onChange={handleChange('email')} className={inputClasses} autoComplete="email" /></Field>
            <Field label="Mobile phone" required><input required type="tel" value={formData.phone} onChange={handleChange('phone')} className={inputClasses} autoComplete="tel" /></Field>
            <div className="sm:col-span-2"><Field label="Street address" required><input required value={formData.address} onChange={handleChange('address')} className={inputClasses} autoComplete="street-address" /></Field></div>
            <Field label="City" required><input required value={formData.city} onChange={handleChange('city')} className={inputClasses} autoComplete="address-level2" /></Field>
            <Field label="State / province" required><input required value={formData.state} onChange={handleChange('state')} className={inputClasses} autoComplete="address-level1" /></Field>
            <Field label="Postal code" required><input required value={formData.postalCode} onChange={handleChange('postalCode')} className={inputClasses} autoComplete="postal-code" /></Field>
          </div>
        </Section>

        <Section icon={CreditCard} title="Insurance & Financial Details" description="Provide coverage information to support eligibility and billing.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Insurance status" required><select required value={formData.insuranceStatus} onChange={handleChange('insuranceStatus')} className={inputClasses}><option value="insured">I have insurance</option><option value="self-pay">I will self-pay</option><option value="unknown">I am not sure</option></select></Field>
            {formData.insuranceStatus === 'insured' && <>
              <Field label="Insurance provider" required><input required value={formData.insuranceProvider} onChange={handleChange('insuranceProvider')} className={inputClasses} placeholder="e.g. Blue Cross" /></Field>
              <Field label="Member / policy ID" required><input required value={formData.memberId} onChange={handleChange('memberId')} className={inputClasses} /></Field>
              <Field label="Group number"><input value={formData.groupNumber} onChange={handleChange('groupNumber')} className={inputClasses} /></Field>
              <Field label="Policy holder name"><input value={formData.policyHolderName} onChange={handleChange('policyHolderName')} className={inputClasses} /></Field>
            </>}
          </div>
          <p className="mt-3 text-xs text-gray-400">Do not enter bank account, card, or payment passwords here.</p>
        </Section>

        <Section icon={Users} title="Emergency Contact" description="Someone we can reach if urgent coordination is needed.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" required><input required value={formData.emergencyName} onChange={handleChange('emergencyName')} className={inputClasses} /></Field>
            <Field label="Relationship" required><select required value={formData.emergencyRelationship} onChange={handleChange('emergencyRelationship')} className={inputClasses}><option value="">Select...</option>{RELATIONSHIPS.map((option) => <option key={option}>{option}</option>)}</select></Field>
            <Field label="Phone number" required><input required type="tel" value={formData.emergencyPhone} onChange={handleChange('emergencyPhone')} className={inputClasses} /></Field>
            <Field label="Email address"><input type="email" value={formData.emergencyEmail} onChange={handleChange('emergencyEmail')} className={inputClasses} /></Field>
          </div>
        </Section>

        <Section icon={ShieldCheck} title="Legal & Consent" description="Confirm these details before completing enrollment.">
          <div className="space-y-4">
            <Field label="Legal signature" required><input required value={formData.legalName} onChange={handleChange('legalName')} placeholder="Type your full legal name" className={inputClasses} /></Field>
            <label className="flex items-start gap-3 text-sm text-gray-700"><input required type="checkbox" checked={formData.consentTreatment} onChange={handleChange('consentTreatment')} className="mt-1 h-4 w-4 accent-blue-600" /><span>I consent to MediCare AI storing my profile details and using them to support my care coordination. <span className="text-red-500">*</span></span></label>
            <label className="flex items-start gap-3 text-sm text-gray-700"><input required type="checkbox" checked={formData.consentPrivacy} onChange={handleChange('consentPrivacy')} className="mt-1 h-4 w-4 accent-blue-600" /><span>I acknowledge the privacy notice and understand that this app does not replace a licensed healthcare professional. <span className="text-red-500">*</span></span></label>
          </div>
        </Section>

        <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><FileCheck size={16} />{isSaving ? 'Saving enrollment...' : 'Save Profile'}</button>
          {saved && <span className="text-sm text-green-600">Profile saved successfully.</span>}
        </div>
      </form>
    </div>
  )
}

export default Profile
