import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Container } from '@/components/ui/container';
import Link from 'next/link';

const GeneralPassportInfo = () => {
  return (
    <div>
      <h1 className='text-center mb-5'>Issue of Passports</h1>
      <h2 className='text-blue-500'>Ordinary Passports</h2>
      <p>Passports Valid for All Countries</p>
      <h3 className='mt-5'>Commonly Asked Questions related to Ordinary Passports</h3>
      <Accordion type='single' collapsible>
        <AccordionItem value='iop-1.'>
          <AccordionTrigger>
            What are the documents required to be submitted along with the completed application
            form ?
          </AccordionTrigger>
          <AccordionContent>
            <Container>
              <p>
                1. Current passport with a photocopy of the Bio data page. (Please see below for
                details*)
              </p>
              <p>2. Photo studio acknowledgement</p>
              <p>3. Original Birth Certificate of the applicant with a photocopy.</p>
              <p>4. Original National Identity Card of the applicant with a photocopy.</p>
              <p>
                5. Marriage certificate with a photocopy where it is necessary (To confirm the name
                after marriage)
              </p>
              <p>
                6. Educational Certificate related to the profession and an acceptable document to
                confirm your service and photocopies thereof. (Acadamic certificate & service
                certificate)
              </p>

              <p className='mt-5 font-semibold text-black'>For Buddhist priests:</p>
              <p>
                It is mandatory to submit the Samanera certificate or Higher Ordination certificate
                along with photocopies.
              </p>

              <p className='mt-5 text-red-500'>
                *If you already have a valid passport it should be submitted along with the
                application.
              </p>
            </Container>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='iop-1.2'>
          <AccordionTrigger>Where can I obtain an Application Form ?</AccordionTrigger>
          <AccordionContent>
            <p>1. Head office of the Department of Immigration & Emigration, Battaramulla</p>
            <p>2. Regional Offices at Kandy, Matara, Vavuniya and Kurunegala</p>
            <p>3. Divisional Secretariat of your area</p>
            <p>4. Overseas Sri Lankan Missions</p>
            <p>
              5. Download printable versions of the Application Forms{' '}
              <Link
                href='https://www.immigration.gov.lk/content/files/applications/passport_application.pdf'
                className='link hover:underline'
              >
                here
              </Link>
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='iop-1.3'>
          <AccordionTrigger>Where can I submit my application ?</AccordionTrigger>
          <AccordionContent>
            <div>
              <p>
                You can <span className='font-semibold text-black'>Physically</span> submit your
                application at the following locations:
              </p>
              <Container>
                <p>1. Head office of the Department of Immigration & Emigration, Battaramulla</p>
                <p>2. Regional Offices at Kandy, Matara, Vavuniya and Kurunegala</p>
                <p>3. Divisional Secretariat of your area</p>
              </Container>
            </div>

            <div className='mt-5'>
              <p>
                You can <span className='font-semibold text-black'>Virtually</span> submit your
                application at the following websites:
              </p>
              <Container>
                <p>1. PassGo Application Submission and Validation Portal</p>
                <p>2. Regional Offices at Kandy, Matara, Vavuniya and Kurunegala</p>
              </Container>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='iop-1.4'>
          <AccordionTrigger>
            What are the delivery times and Processing Fees for All-Countries Passport ? ?
          </AccordionTrigger>
          <AccordionContent>
            <p>Normal Basis – 30 working days (Processing Fee: Rs. 10,000)</p>
            <p>Urgent Basis – Same day (Processing Fee: Rs. 20,000)</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <h2 className='text-blue-500 mt-10'>
        Sri Lankan passports for Underage (Minor) Applicants/ Adopted Children (Validity period for
        3 or 10 years)
      </h2>
      <Accordion type='single' collapsible>
        <AccordionItem value='iop-2.1'>
          <AccordionTrigger>Who is a minor ?</AccordionTrigger>
          <AccordionContent>
            <p>Any person below 16 years of age is considered as a minor for this purpose.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='iop-2.2'>
          <AccordionTrigger>How can a minor apply for Sri Lankan passport ?</AccordionTrigger>
          <AccordionContent>
            <p>
              Either the parents or the legal guardian of the applicant should accompany him/her
              when the applicant comes to the application accepting office to submit the
              application. A letter of consent from parents or the legal guardian should be attached
              to the application.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='iop-2.3'>
          <AccordionTrigger>
            What are the documents required to be submitted along with the completed application ?
          </AccordionTrigger>
          <AccordionContent>
            <Container>
              <div>
                <p>1. Original Birth certificate of the applicant with a photocopy</p>
                <p>2. Photo studio acknowledgement</p>
                <p>3. Parent&apos;s Passport (with photocopies of data page & child page)</p>
                <p>4. If parents do not have passports submit the National Identity Card</p>
                <p>
                  5. Consent Letter of the Parents (Either the parents or the legal guardian of the
                  applicant should accompany)
                </p>
                <p>6. Current passport with a photocopy of Bio data page (If available)</p>

                <p className='mt-5 font-semibold text-black'>
                  For adopted children, additional documents required:
                </p>
                <p>1. Certificate of Adoption</p>
                <p>2. The court order</p>
                <p>3. A letter from the Commissioner of Probation and Child Care</p>

                <p className='mt-5 font-semibold text-black'>Special Notes:</p>
                <p className='text-sm text-gray-600 mb-2'>
                  Originals of the documents must be submitted along with photocopies. The following
                  documents should be submitted under special circumstances:
                </p>
                <ul className='list-disc pl-5 space-y-2 text-sm text-gray-600'>
                  <li>
                    If the applicant is born outside of Sri Lanka: Consular Birth Certificate and
                    Citizenship Registration Certificate
                  </li>
                  <li>
                    If parent(s) do not possess a valid Sri Lankan passport: An affidavit confirming
                    that fact and the National Identity Card
                  </li>
                  <li>
                    If parent(s) are dead: Original Death Certificate(s), Legal Guardian&apos;s
                    Identification Document, Guardian&apos;s consent letter and a report from Grama
                    Niladhari attested by the Divisional Secretary
                  </li>
                  <li>
                    If one or both parents are abroad: The consent letter and the passport copies of
                    parents should be certified by the relevant Sri Lankan Mission
                  </li>
                  <li>
                    If both parents are abroad: Acceptable authorization letter given by the parents
                    to the legal guardian should be certified by the relevant Sri Lankan Mission
                  </li>
                  <li>
                    If the parents are divorced: Original Divorce Certificate and the court order
                    stating the right to the custody of the child/children
                  </li>
                  <li>
                    If the child has been abandoned by the parents: Certified copy of the police
                    report and a confirmation letter from the Grama Niladhari countersigned by the
                    Divisional Secretary
                  </li>
                </ul>
              </div>
            </Container>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='iop-2.4'>
          <AccordionTrigger>
            What are the processing fees for minors (below 16 years of age)?
          </AccordionTrigger>
          <AccordionContent>
            <Container>
              <div>
                <p className='font-semibold mb-3'>Validity period for 3 years:</p>
                <ul className='list-disc pl-5 mb-4'>
                  <li>Normal Basis - LKR. 3,000.00</li>
                  <li>Urgent Basis - LKR. 9,000.00</li>
                </ul>

                <p className='font-semibold mb-3'>Validity period for 10 years:</p>
                <ul className='list-disc pl-5'>
                  <li>Normal Basis - LKR. 10,000.00</li>
                  <li>Urgent Basis - LKR. 20,000.00</li>
                </ul>
              </div>
            </Container>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default GeneralPassportInfo;
