<?php

namespace App\Mail\Evaluations\Evaluation360;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class sendReport extends Mailable
{
    use Queueable, SerializesModels;
    public $evaluation_id;
    public $evaluation_name;
    public $evaluated_user;


    /**
     * Create a new message instance.
     */
    public function __construct($evaluation_name, $evaluated_user, $evaluation_id)
    {
        $this->evaluation_name = $evaluation_name;
        $this->evaluated_user = $evaluated_user;
        $this->evaluation_id = $evaluation_id;
    }

    /**
     * Get the message envelope.
     */ //brenda.ortiz@trinitas.mx
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('notificaciones@trintias.com'),
     
            subject: 'Evaluaciones'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'Evaluations/Evaluation360/ReportComplete',
            with: [
                'evaluation_name' => $this->evaluation_name,//name
                'evaluated_user' => $this->evaluated_user,//id
                'evaluation_id'=>$this->evaluation_id,//evaluation_id
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
