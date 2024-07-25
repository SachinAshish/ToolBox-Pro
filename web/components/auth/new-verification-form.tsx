'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import CardWrapper from './card-wrapper';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { newVerification } from '@/actions/auth/new-verification';
import FormSuccess from '../form-success';
import FormError from '../form-error';

type Props = {};

const NewVerificationForm = (props: Props) => {
   const initialized = useRef(false);

   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

   const searchParams = useSearchParams();
   const token = searchParams.get('token');

   const onSubmit = useCallback(() => {
      if (!token) {
         setError('Missing Token!');
         return;
      }
      newVerification(token)
         .then((data) => {
            setSuccess(data.success || '');
            setError(data.error || '');
         })
         .catch(() => {
            setError('Something went wrong!');
         });
   }, [token]);

   useEffect(() => {
      if (!initialized.current) {
         initialized.current = true;
         onSubmit();
      }
   }, []);

   return (
      <CardWrapper
         headerLabel="Confirming your verification"
         backButtonLabel="Back to login"
         backButtonHref="/auth/login"
      >
         <div className="flex w-full flex-col items-center justify-center gap-y-5">
            {!success && !error && <BeatLoader />}
            <FormSuccess message={success} />
            <FormError message={error} />
         </div>
      </CardWrapper>
   );
};

export default NewVerificationForm;
