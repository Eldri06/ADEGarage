<?php

namespace Tests\Feature;

use Tests\TestCase;

class ClassroomCtfTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config()->set('ctf.legacy_email', 'legacy@adegarage.ctf');
        config()->set('ctf.legacy_password', 'honda-dream-1949');
        config()->set('ctf.flag', 'CTF{legacy_auth_complete}');
    }

    public function test_ctf_routes_are_hidden_until_explicitly_enabled(): void
    {
        config()->set('ctf.enabled', false);

        $this->get('/ctf/legacy-login')->assertNotFound();
    }

    public function test_fake_credentials_only_unlock_the_ctf_flag(): void
    {
        config()->set('ctf.enabled', true);

        $this->post('/ctf/legacy-login', [
            'email' => 'legacy@adegarage.ctf',
            'password' => 'honda-dream-1949',
        ])->assertRedirect(route('ctf.legacy.show'));

        $this->get('/ctf/legacy-login')
            ->assertOk()
            ->assertSee('CTF{legacy_auth_complete}');

        $this->assertGuest();
    }

    public function test_homepage_shows_ctf_link_only_while_ctf_mode_is_enabled(): void
    {
        config()->set('ctf.enabled', false);
        $this->get('/')->assertDontSee('Classroom CTF: Legacy Login');

        config()->set('ctf.enabled', true);
        $this->get('/')->assertSee('Classroom CTF: Legacy Login');
    }
}
