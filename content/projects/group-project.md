+++
title = "CS:IB Group Project : ModularSynth"
date = 2023-03-14
[taxonomies]
tags=["cpp", "cs"]
[extra]
img = "/projects/midi.png"
style="wild-partial"
+++
 
Winner: [Most Impressive Professional Achievement](https://www.cst.cam.ac.uk/news/students-find-success-design-project-awards), Nominated: Most Impressive Technical Achievement[^0].

<!-- more -->

## Original Brief

> Client: George Welch, IMC

Sophisticated digital music composition tools like the Sonic Pi language rely on an internal architecture of samples, waveforms and filters. In the popular SuperCollider system, a new synthesiser is defined by software-wiring together these "UGens". Your task is to create a SuperCollider client that looks like a retro-style modular synthesiser or guitar pedal board, where connecting literal wires between pictures of hardware modules on the screen will construct an exact digital equivalent within the SuperCollider server. A live audio input would give you a universal guitar pedal, sample mixing makes you a DJ/producer, or if bleeps and whooshes are your thing, you can impress your Grandpa by channelling Brian Eno in the glory days of Roxy Music.

## Overall Experience

My overall experience with the project was positive; all members of the team mostly agreed on all design decisions, used git with branches effectively to manage collaboration, and kept to most key timelines.

In terms of code, the largest issues with the (my region, backend of) project was the lack of unit tests on higher levels of the code - all tests where implementation tests, meaning testing higher level units in isolation was impossible and proved not useful to debug, although very useful to verify the entire project was working. The solution to this would have been to make a dummy library to take the place of lower level ones and substituting out objects for dummies, then testing the state of those instead of the root supercollider servers.

![MIDI Module](/projects/midi.png)

## Personal Contribution

My first work was experimenting with control of a supercollider server in python, which taught me a lot about the workings of the server and gave us early knowledge about the capabilities and limitations of the server. This prototype was based around a simple command line control, with no UI, and gave us the first set of synthdefs (audio functions), and midi playback, although these were both to be heavily improved.

My next work was in the C++ source code. (Aside: why did we code the backend in C++, when it's purpose was to manage a web API and the front was written in C#? Because teamwork requires compromise, and the other backend members wanted C++ experience). I started by setting up a CMake build chain that would be used through the project, splitting the layers of the backend that were to exist into individual libraries, which proved very useful for collaborative coding, as we could work on specific areas of code even if others were currently broken or undocumented.

The first lines of code written in C++ was a simple object oriented wrapper around the supercollider server, known as the SCOOP layer, allowing the upload of synthdefs, instantiation of synths, playing and pausing of synths, and assignment of constant parameters. With this done, the scale of implementing the rest of the OSC commands exposed by supercollider became daunting, so I switched to automatic code generation, resulting in almost 800 lines of automatically generated *and* autodoc'd C++ functions based on the documentation available on the website, which was a significant timesaver in the long run.

At this point, roughly week 5, the roadblock of backend/frontend communication had become an issue as our implementation goal of week three slipped further away, and I thought the method currently being looked at of a C-style API to interact with our already convoluted and very object oriented C++ project would likely not be finished in time for anyone to actually use it, so I introduced the C++/CLR (language? compiler?) to replace this, as it was specifically designed for this task, and much easier to work with (once you get past Microsoft's full lack of documentation).

C++/CLR compiles C++ code to the common language runtime, the same platform C# runs on, as well as exporting all required metadata to allow C# to consume the `.dll` file as a dotnet native library, giving very performant interop as the only meaningful marshalling required are to convert strings from C# 16 bit unicode to C style 8 bit ASKII strings. This module then links to the previously compiled libraries from the lower layers of the code, still compiled in native form, meaning after the interop stage we are running full performance C++ code.

After this, I quickly implemented audio/control rate changes for buses and synths for use in the layer above, required to allow some synths to write into the parameters of other synths. My next big goal was implementing MIDI, which turned into a large task, but I was pretty happy with the result. The main challenge was this being the first sound creating module that wasn't represented on the server, but had to manually send commands to set the frequencies of notes being played over buses, which meant synths had to maintain a control thread to execute.

Testing the MIDI was a difficult task, as there were suddenly a huge amount more layers of things to go wrong, and a small collection of fixes made to support this includes: many bugs in the graph model automatic rate changing logic, fixing server model inconsistencies, and large changes to the C++/CLR marshalling layer to better support ports.

The biggest issue with MIDI compared to synthesisers are the limitation of synthesisers playing a single note at a time. My ideal solution to this would have been to allow the `Bus` class to represent multiple server side busses to carry a collection of frequencies at once, and similarly duplicate synths on the server side. Most of the work for this was done, but due to time constraints could not be fully implemented, meaning each midi channel could only output 2 notes, and required them to be outputted into 2 distinct synths, resulting in 32 ports on the midi module, which was not very intuitive. An existing issue with rate switching logic also meant the midi controller could not output to all synth types, notably only working when connected to the organ module.

## Contributions of Other Members

I am most familiar with the contributions of 1. █████ █████ and 4. █████ █████, as they worked in the same area of the project as me.

### 1. █████ █████

█████ worked mainly on the graph network for the supercollider model, ensuring cyclic connections and a single input to each
"wire group" was maintained throughout the running of the program. This included making some of the higher level classes exposed to
front-end, including `Section.cpp`, which had many utility functions for connecting ports and diagnosing the issues with connections
should they occur so the front-end could tell the user what had gone wrong, useful as part of the goal of the project was to introduce
new users to the concepts of modular synths.

They were also very involved to project management, organising meetings with the client and ensuring communication between the 3 members of
the backend, and developed integration tests for the entire library.

### 2. █████ █████

█████ worked heavily on the front-end, developing an entity management system to be integrated with the 2D rendering framework Monogame,
which was then used by them to develop a grid system to drag and drop modules around on and component rendering system to draw and track
positions of knobs and dials and the like of synthesiser modules.

### 3. █████ █████

█████ worked on a huge variety of tasks, starting with attempting to design a c-style dll compatibility layer, which was ultimately replaced,
to working on a large amount of UI design for components, developing the graphics for dangling wires and most other intractable UI components.
Along with this, they used blender to develop high quality and easily readable graphics for different modules, excepting the midi
and organ graphics which were made by me, and overall contributed heavily to the polished look and feel of the final product.

### 4. █████ █████

█████ worked on the higher level of Supercollider, using my SCOOP library to design `LogicalBus.cpp` which allowed the merging and
separating of groups of synths reading and writing to the same parameters, allowing the node based representation above it to easily
set synths to read and write to each other. They also helped me with a large amount of debugging and editing to the SCOOP layer.

### 5. █████ █████

█████ worked on the json representation of modules for the instantiation of their set of UI components and graphics. This worked
with a two file system, one file defining what parameters a synthdef contained and their limits, and another file defining how these
parameters would be represented with components on a module. This allowed for multiple modules referring to the same synthdef,
useful for when different synthdefs could produce a large variety of sounds, for example the `sin-ar` synthdef which could be
used for low frequency 0-20Hz control, or audible frequency 100-10000Hz to produce sounds, and separating these use cases into
two modules was very useful.

## Source Code

The main loop of the MIDI Controller, run in a background thread:

```cpp
void MidiSynth::ControlLoop(std::string const& source)
{ 

	//read file
	std::ifstream infile{ source, std::ios_base::binary };

	std::vector<uint8_t> bytes;
	bytes.assign(std::istreambuf_iterator<char>(infile), std::istreambuf_iterator<char>());

	libremidi::reader r{true};
	//Parse the file
	auto res = r.parse(bytes);

	if (res == libremidi::reader::parse_result::invalid) {
		throw std::invalid_argument("MIDI from " + source + " invalid!");
	}

	if (r.tracks.size() == 0) {
		throw std::invalid_argument("MIDI from " + source + " has no tracks!");
	}

	float bps = r.startingTempo / 60.0;


	std::array<int, 16> track_clock{};
	std::array<std::array<int, 2>, 16> playing{};

	int tick = 0;

	std::chrono::steady_clock clock{};

	auto last_clock = clock.now();

	//Loop it forever, checking state of source object
	while (true) {

		int next = -1;
		int next_tick = 10000000;
		libremidi::message msg;

		for (size_t i = 0; i < r.tracks.size(); i++)
		{
			if (r.tracks[i].size() > track_clock[i] && r.tracks[i][track_clock[i]].tick < next_tick) {
				next = i;
				next_tick = r.tracks[i][track_clock[i]].tick;
				msg = r.tracks[i][track_clock[i]].m;
			}
		}

		if (next == -1) {
			// loop!
			track_clock = {};
			playing = {};
			tick = 0; 
			bps = r.startingTempo / 60.0;

			continue;
		}

		track_clock[next]++;
		
		// Wait for the event to happen, minus the time that has elapsed since the last event
		auto process_time = clock.now() - last_clock;

		std::this_thread::sleep_for(std::chrono::microseconds((int)(1000000 * (next_tick - tick)/ r.ticksPerBeat / bps)) - process_time);
		
		last_clock = clock.now();

		tick = next_tick;

		int note;

		if (msg.is_meta_event())
		{
			switch (msg.get_meta_event_type())
			{
			case libremidi::meta_event_type::TEMPO_CHANGE:
			{
				int len = msg.bytes[2];

				int tempo = 0;
 
				for (size_t i = 0; i < len; i++)
				{ 
					tempo <<= 8;
					tempo += msg.bytes[3 + i];
				} 

				bps = (60000000.0 / tempo) / 60; 

				break;
			}

			default: 
				break;
			}
		}
		else
		{
			switch (msg.get_message_type())
			{
			case libremidi::message_type::NOTE_ON:
				note = (int)msg.bytes[1];

				if (playing[next][0] == 0) {
					playing[next][0] = note;
					std::get<Bus>(controls[channels[next][0]]).set(from_midi_note(note));
				}
				else if (playing[next][1] == 0) {
					playing[next][1] = note;
					std::get<Bus>(controls[channels[next][1]]).set(from_midi_note(note));
				}
				else {
					//std::cout << "- Missed the note!";
				}

				break;
			case libremidi::message_type::NOTE_OFF:
				
				note = (int)msg.bytes[1];
				//std::cout << "Note OFF: "
				//	<< "channel " << msg.get_channel() << ' '
				//	<< "note " << note << ' '
				//	<< "velocity " << (int)msg.bytes[2] << ' ';

				if (playing[next][0] == note) {
					playing[next][0] = 0;
					std::get<Bus>(controls[channels[next][0]]).set(0);
				}else if (playing[next][1] == note) {
					playing[next][1] = 0;
					std::get<Bus>(controls[channels[next][1]]).set(0);
				}

				break;
			default:
				//std::cout << "Unsupported.";
				break;
			}
		}
	//	std::cout << '\n';

	}
}

```

Here is an example of the original C++/CLR template designed with the first working interop.

```cpp
// compile with: /clr /LD

#include <vcclr.h>
#include <Synth.hpp>
#include <msclr\marshal_cppstd.h>
#using <System.dll>

using namespace System;

//ATM this "Section" uses the lower level synth abstraction
// Needs to be changed to the port model, this is a proof of concept

namespace SynthAPI {

	public ref class SCSection {

	private:

		array< String^ >^ params;
		Synth* m_Impl;
	public:

		// Allocate the native object on the C++ Heap via a constructor

		SCSection(String^ synthdef) {

			try {
				//Generate the synth on the server.
				//Currently blocking, in future will use a bool valid
				m_Impl = SuperColliderController::get().InstantiateSynth(msclr::interop::marshal_as<std::string>(synthdef));
				auto size = m_Impl->controls.size();
				params = gcnew array< String^ >(size);
				int i = 0;
				// Cache the params of the function locally, to save lots of re-generating of strings
				for (auto it = m_Impl->controls.begin(); it != m_Impl->controls.end(); ++it) {

					params[i] = gcnew String(it->first.c_str());

					i++;
				}
			}
			catch (std::exception& ex) {
				//standard conversion from native to managed exception
				throw gcnew System::Exception(gcnew System::String(ex.what()));
			}
		}
	
		// Deallocate the native object on a destructor
		~SCSection() {
			delete m_Impl;
		}

	protected:

		// Deallocate the native object on the finalizer just in case no destructor is called
	
		!SCSection() {
			delete m_Impl;
		}

	public:

		//Currently a null check, in future will also show if the node exists on the server yet
		bool Valid() {
			return m_Impl != nullptr;
		}

		//This all works with the old model, but without any wire attachments its pretty much useless

		void Set(String^ param, float value) {
			auto s = msclr::interop::marshal_as<std::string>(param);
			m_Impl->set(s, value);
		}

		float Get(String^ param) {
			auto s = msclr::interop::marshal_as<std::string>(param);
			return std::get<float>(m_Impl->get(s));
		}

		property array<String^>^ controls {
			array<String^>^ get(){ return params; }
		}

		property int index {
			int get() { return m_Impl->index; }
		}

		void Run(bool run) {
			m_Impl->Run(run);
		}
	};
}
```

---
[^0]: based on the [video](https://www.youtube.com/watch?v=iWxWJKYrUTY&list=PLstyePOvf2d2ZvC92BQkpR6WiaiROytev&index=13) we made for it
