<?php

namespace App\Mail\General;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class resetPassword extends Mailable
{
    use Queueable, SerializesModels;
    public $name;
    public $email;
    public $encrypt;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $email, $encrypt)
    {
        //
        $this->email = $email;
        $this->name = $name;
        $this->encrypt = $encrypt;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('notificaciones@trintias.com'),
            subject: 'Cambiar contraseña'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'Evaluations/Reset',
            with: [
                'name' => $this->name,
                'email' => $this->email,
                'url' => 'https://miespacio.trinitas.mx/#/resetPassword/' . $this->encrypt
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
