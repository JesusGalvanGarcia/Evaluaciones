<?php

namespace App\Mail\Evaluations;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class Signatures extends Mailable
{
    use Queueable, SerializesModels;

    public $evaluation_name;
    public $evaluated_user;
    public $responsable_user;

    /**
     * Create a new message instance.
     */
    public function __construct($evaluation_name, $evaluated_user, $responsable_user)
    {
        $this->evaluation_name = $evaluation_name;
        $this->evaluated_user = $evaluated_user;
        $this->responsable_user = $responsable_user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address($this->responsable_user->email, $this->responsable_user->name . ' ' . $this->responsable_user->father_last_name . ' ' . $this->responsable_user->mother_last_name),
            replyTo: [
                new Address('yunuen.vejar@trinitas.mx', 'Yunuen Vejar Badillo'),
            ],
            subject: 'Firma de plan de acción.'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'Evaluations/DesempeñoyCompetencias/SignaturesComplete',
            with: [
                'evaluation_name' => $this->evaluation_name,
                'evaluated_user' => $this->evaluated_user,
                'responsable_user' => $this->responsable_user
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
