import { useState } from 'react'
import {
  CreditCard,
  FileCheck,
  MapPin,
  Printer,
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

function PrintField({ label, value }) {
  return (
    <div className="print-field">
      <dt>{label}</dt>
      <dd>{value || 'Not provided'}</dd>
    </div>
  )
}

function PrintableProfile({ profile }) {
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ')
  const address = [profile.address, profile.city, profile.state, profile.postalCode]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="print-only print-sheet">
      <header className="print-header">
        <div>
          <p className="print-kicker">MediCare AI</p>
          <h1>Patient Enrollment Record</h1>
          <p>Confidential patient information - print date: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="print-status">{profile.consentPrivacy && profile.consentTreatment ? 'Enrollment confirmed' : 'Enrollment incomplete'}</div>
      </header>

      <section className="print-section">
        <h2>Patient Identification</h2>
        <dl className="print-grid">
          <PrintField label="Legal name" value={fullName} />
          <PrintField label="Preferred name" value={profile.preferredName} />
          <PrintField label="Date of birth" value={profile.dateOfBirth} />
          <PrintField label="Sex" value={profile.sex} />
          <PrintField label="Blood type" value={profile.bloodType} />
          <PrintField label="Height / weight" value={[profile.height && `${profile.height} cm`, profile.weight && `${profile.weight} kg`].filter(Boolean).join(' / ')} />
        </dl>
      </section>

      <section className="print-section">
        <h2>Contact Information</h2>
        <dl className="print-grid">
          <PrintField label="Email" value={profile.email} />
          <PrintField label="Mobile phone" value={profile.phone} />
          <PrintField label="Address" value={address} />
        </dl>
      </section>

      <section className="print-section">
        <h2>Insurance and Financial Details</h2>
        <dl className="print-grid">
          <PrintField label="Insurance status" value={profile.insuranceStatus} />
          <PrintField label="Provider" value={profile.insuranceProvider} />
          <PrintField label="Member / policy ID" value={profile.memberId} />
          <PrintField label="Group number" value={profile.groupNumber} />
          <PrintField label="Policy holder" value={profile.policyHolderName} />
        </dl>
      </section>

      <section className="print-section">
        <h2>Emergency Contact</h2>
        <dl className="print-grid">
          <PrintField label="Name" value={profile.emergencyName} />
          <PrintField label="Relationship" value={profile.emergencyRelationship} />
          <PrintField label="Phone" value={profile.emergencyPhone} />
          <PrintField label="Email" value={profile.emergencyEmail} />
        </dl>
      </section>

      <section className="print-section">
        <h2>Legal and Consent</h2>
        <dl className="print-grid">
          <PrintField label="Legal signature" value={profile.legalName} />
          <PrintField label="Care coordination consent" value={profile.consentTreatment ? 'Confirmed' : 'Not confirmed'} />
          <PrintField label="Privacy acknowledgement" value={profile.consentPrivacy ? 'Confirmed' : 'Not confirmed'} />
        </dl>
      </section>

      <footer className="print-footer">This document contains confidential health information. Handle and store it securely.</footer>
    </div>
  )
}

function escapePrintValue(value) {
  return String(value || 'Not provided')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      window.print()
      return
    }

    const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ')
    const address = [formData.address, formData.city, formData.state, formData.postalCode]
      .filter(Boolean)
      .join(', ')
    const field = (label, value) => `<div class="field"><span>${escapePrintValue(label)}</span><strong>${escapePrintValue(value)}</strong></div>`
    const section = (title, content) => `<section><h2>${escapePrintValue(title)}</h2><div class="grid">${content}</div></section>`

    let hasPrinted = false
    const printDocument = () => {
      if (hasPrinted) return
      hasPrinted = true
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
    printWindow.onload = printDocument
    printWindow.document.open()
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Patient Enrollment Record</title>
          <style>
            @page { size: A4; margin: 14mm; }
            * { box-sizing: border-box; }
            body { margin: 0; color: #172033; font-family: Arial, sans-serif; font-size: 11px; }
            header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #2563eb; padding-bottom: 14px; }
            .brand { color: #2563eb; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
            h1 { margin: 4px 0; font-family: Georgia, serif; font-size: 24px; line-height: 1.2; }
            header p { margin: 0; color: #64748b; font-size: 10px; }
            .status { height: max-content; border: 1px solid #bfdbfe; border-radius: 20px; color: #1d4ed8; font-size: 10px; font-weight: 700; padding: 6px 10px; white-space: nowrap; }
            section { break-inside: avoid; border-bottom: 1px solid #dbe3ee; padding: 16px 0 14px; page-break-inside: avoid; }
            h2 { margin: 0 0 10px; color: #1d4ed8; font-size: 12px; letter-spacing: .4px; text-transform: uppercase; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px 28px; }
            .field span { display: block; color: #64748b; font-size: 9px; font-weight: 700; text-transform: uppercase; }
            .field strong { display: block; margin-top: 2px; font-weight: 400; overflow-wrap: anywhere; }
            footer { padding-top: 16px; color: #64748b; font-size: 9px; }
          </style>
        </head>
        <body>
          <header>
            <div><div class="brand">MediCare AI</div><h1>Patient Enrollment Record</h1><p>Confidential patient information - print date: ${escapePrintValue(new Date().toLocaleDateString())}</p></div>
            <div class="status">${formData.consentPrivacy && formData.consentTreatment ? 'Enrollment confirmed' : 'Enrollment incomplete'}</div>
          </header>
          ${section('Patient Identification', field('Legal name', fullName) + field('Preferred name', formData.preferredName) + field('Date of birth', formData.dateOfBirth) + field('Sex', formData.sex) + field('Blood type', formData.bloodType) + field('Height / weight', [formData.height && `${formData.height} cm`, formData.weight && `${formData.weight} kg`].filter(Boolean).join(' / ')))}
          ${section('Contact Information', field('Email', formData.email) + field('Mobile phone', formData.phone) + field('Address', address))}
          ${section('Insurance and Financial Details', field('Insurance status', formData.insuranceStatus) + field('Provider', formData.insuranceProvider) + field('Member / policy ID', formData.memberId) + field('Group number', formData.groupNumber) + field('Policy holder', formData.policyHolderName))}
          ${section('Emergency Contact', field('Name', formData.emergencyName) + field('Relationship', formData.emergencyRelationship) + field('Phone', formData.emergencyPhone) + field('Email', formData.emergencyEmail))}
          ${section('Legal and Consent', field('Legal signature', formData.legalName) + field('Care coordination consent', formData.consentTreatment ? 'Confirmed' : 'Not confirmed') + field('Privacy acknowledgement', formData.consentPrivacy ? 'Confirmed' : 'Not confirmed'))}
          <footer>This document contains confidential health information. Handle and store it securely.</footer>
        </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(printDocument, 1000)
  }

  return (
    <div className="pb-8">
      <div className="print-hidden mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <UserRound size={23} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Patient Profile</h1>
              <p className="text-sm text-gray-500">Complete your enrollment details for safer, smoother care.</p>
            </div>
          </div>
          <button type="button" onClick={handlePrint} className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
            <Printer size={16} />
            Print Patient Record
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-500"><span className="text-red-500">*</span> Required for enrollment. Optional details can be added later.</p>
      </div>

      <form onSubmit={handleSubmit} className="print-hidden max-w-4xl space-y-7 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
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

      <div className="print-hidden mx-auto mt-10 max-w-4xl border-t border-gray-200 pt-6 text-center">
        <p className="text-xs font-semibold text-gray-400">Developed by:</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">Monesh The Unleashed</p>
        <p className="mt-2 font-mono text-xs font-medium uppercase tracking-[0.28em] text-gray-500">Software Developer</p>
      </div>

      <PrintableProfile profile={formData} />
    </div>
  )
}

export default Profile
