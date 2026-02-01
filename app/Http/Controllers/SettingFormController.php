<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\FormTemplate;

class SettingFormController extends Controller
{
    public function index()
    {
        $templates = FormTemplate::orderBy('category')->orderBy('step')->get();

        return Inertia::render('lppm/SettingForm', [
            'title' => 'Manajemen Form & Atribut',
            'templates' => $templates
        ]);
    }

    public function update(Request $request, $id)
    {
        $template = FormTemplate::findOrFail($id);
        $request->validate([
            'fields' => 'required|array'
        ]);

        $template->update([
            'fields' => $request->fields,
            'version' => $template->version + 1
        ]);

        return redirect()->back()->with('success', 'Form template updated successfully.');
    }
}
