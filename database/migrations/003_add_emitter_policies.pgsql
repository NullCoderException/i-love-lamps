--postgresql
-- Add missing RLS policies for emitters table

-- Users can view emitters for their own flashlights
CREATE POLICY "Users can view emitters for their flashlights" 
  ON emitters 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = emitters.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

-- Users can insert emitters for their own flashlights
CREATE POLICY "Users can insert emitters for their flashlights" 
  ON emitters 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = emitters.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

-- Users can update emitters for their own flashlights
CREATE POLICY "Users can update emitters for their flashlights" 
  ON emitters 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = emitters.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

-- Users can delete emitters for their own flashlights
CREATE POLICY "Users can delete emitters for their flashlights" 
  ON emitters 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = emitters.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

-- Also add policies for the junction tables
-- flashlight_form_factors policies
CREATE POLICY "Users can view form factors for their flashlights" 
  ON flashlight_form_factors 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = flashlight_form_factors.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert form factors for their flashlights" 
  ON flashlight_form_factors 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = flashlight_form_factors.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update form factors for their flashlights" 
  ON flashlight_form_factors 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = flashlight_form_factors.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete form factors for their flashlights" 
  ON flashlight_form_factors 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = flashlight_form_factors.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

-- flashlight_special_features policies
CREATE POLICY "Users can view special features for their flashlights" 
  ON flashlight_special_features 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = flashlight_special_features.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert special features for their flashlights" 
  ON flashlight_special_features 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = flashlight_special_features.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update special features for their flashlights" 
  ON flashlight_special_features 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = flashlight_special_features.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete special features for their flashlights" 
  ON flashlight_special_features 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = flashlight_special_features.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

-- user_preferences policies
CREATE POLICY "Users can view their own preferences" 
  ON user_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
  ON user_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON user_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" 
  ON user_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- flashlight_manuals policies
CREATE POLICY "Users can view manuals for their flashlights" 
  ON flashlight_manuals 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = flashlight_manuals.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert manuals for their flashlights" 
  ON flashlight_manuals 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = flashlight_manuals.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update manuals for their flashlights" 
  ON flashlight_manuals 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = flashlight_manuals.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete manuals for their flashlights" 
  ON flashlight_manuals 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM flashlights 
      WHERE flashlights.id = flashlight_manuals.flashlight_id 
      AND flashlights.user_id = auth.uid()
    )
  );