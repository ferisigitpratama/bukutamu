
import { Form, Head } from '@inertiajs/react';
import {
    Mail,
    LockKeyhole,
    ArrowRight,
    UserPlus,
} from 'lucide-react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

import PasskeyVerify from '@/components/passkey-verify';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({
    status,
    canResetPassword,
}: Props) {
    return (
        <>
            <Head title="Login - Digital Guest Book ITN" />

            <PasskeyVerify />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        {/* FORM FIELDS */}
                        <div className="grid gap-5">

                            {/* EMAIL */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-semibold"
                                >
                                    Email Address
                                </Label>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="h-12 pl-10"
                                    />
                                </div>

                                <InputError message={errors.email} />
                            </div>

                            {/* PASSWORD */}
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-semibold"
                                    >
                                        Password
                                    </Label>

                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-medium text-primary hover:underline"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>

                                <div className="relative">
                                    <LockKeyhole className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className="h-12 pl-10"
                                    />
                                </div>

                                <InputError message={errors.password} />
                            </div>

                            {/* REMEMBER ME */}
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />

                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm font-normal text-muted-foreground"
                                >
                                    Remember me
                                </Label>
                            </div>

                            {/* SUBMIT */}
                            <Button
                                type="submit"
                                className="mt-2 h-12 w-full gap-2 text-sm font-semibold"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <>
                                        <Spinner />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="size-4" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* REGISTER */}
                        <div className="border-t border-border pt-5 text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <TextLink
                                href={register()}
                                tabIndex={6}
                                className="font-semibold text-primary hover:underline"
                            >
                                <span className="inline-flex items-center gap-1">
                                    <UserPlus className="size-3.5" />
                                    Sign up
                                </span>
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {/* STATUS */}
            {status && (
                <div className="mt-5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Welcome Back',
    description: 'Sign in to access Digital Guest Book ITN.',
};
