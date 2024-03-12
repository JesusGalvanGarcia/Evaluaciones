<?php

namespace App\Mail\PLD;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class sendCertificate extends Mailable
{
    use Queueable, SerializesModels;
    public $name;
    public $email;
    public $path;
    public $file;
    /**
     * Create a new message instance.
     */
    public function __construct($name, $email,$path,$file)
    {
        $this->name = $name;
        $this->email = $email;
        $this->path = $path;
        $this->file = $file;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address($this->email),
            replyTo: [
                new Address($this->email, $this->name),
            ],
            subject: 'Examen PLD Certificado'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'PLD/Certificate'
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [
            // Utiliza el método attach para agregar el archivo adjunto
            Attachment::fromStorageDisk('s3', $this->path . $this->file)
            ->as('Certificado.pdf')
            ->withMime('application/pdf'),
        ];
    } 
}
